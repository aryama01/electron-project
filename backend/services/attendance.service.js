const Attendance = require('../models/attendance');

const getISTTime = () => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    return new Date(now.getTime() + istOffset);
};

const getISTDate = () => {
    const ist = getISTTime();
    return new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate()));
};

const checkIn = async (employeeId) => {
    const today = getISTDate();

    const existing = await Attendance.findOne({ employeeId, date: today });
    if (existing && existing.checkIn) {
        throw new Error('Already checked in today');
    }

    return await Attendance.findOneAndUpdate(
        { employeeId, date: today },
        { checkIn: getISTTime(), status: 'checked-in' },
        { new: true, upsert: true }
    );
};

const checkOut = async (employeeId) => {
    const today = getISTDate();

    const attendance = await Attendance.findOne({ employeeId, date: today });
    if (!attendance || !attendance.checkIn) {
        throw new Error('No check-in found for today');
    }
    if (attendance.checkOut) {
        throw new Error('Already checked out');
    }

    const checkOutTime = getISTTime();
    const workHours = (checkOutTime - attendance.checkIn) / (1000 * 60 * 60);
    const totalWorkHours = workHours - (attendance.totalBreakTime / 60);

    attendance.checkOut = checkOutTime;
    attendance.totalWorkHours = totalWorkHours;
    attendance.status = 'checked-out';
    
    return await attendance.save();
};

const startBreak = async (employeeId) => {
    const today = getISTDate();

    const attendance = await Attendance.findOne({ employeeId, date: today });
    if (!attendance || !attendance.checkIn) {
        throw new Error('Check in first');
    }
    if (attendance.status === 'on-break') {
        throw new Error('Already on break');
    }

    attendance.breaks.push({ startTime: getISTTime() });
    attendance.status = 'on-break';
    
    return await attendance.save();
};

const endBreak = async (employeeId) => {
    const today = getISTDate();

    const attendance = await Attendance.findOne({ employeeId, date: today });
    if (!attendance || attendance.status !== 'on-break') {
        throw new Error('No active break found');
    }

    const lastBreak = attendance.breaks[attendance.breaks.length - 1];
    lastBreak.endTime = getISTTime();
    lastBreak.duration = (lastBreak.endTime - lastBreak.startTime) / (1000 * 60);

    attendance.totalBreakTime += lastBreak.duration;
    attendance.status = 'checked-in';
    
    return await attendance.save();
};

const getAttendanceRecords = async (employeeId, date = null, page = 1, limit = 10) => {
    const query = { employeeId };
    if (date) {
        const targetDate = new Date(date);
        query.date = new Date(Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()));
    }
    
    const skip = (page - 1) * limit;
    const total = await Attendance.countDocuments(query);
    const attendance = await Attendance.find(query)
        .populate('employeeId', 'firstName lastName username')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);

    return {
        attendance,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

const getAttendanceByDateRange = async (employeeId, startDate, endDate) => {
    return await Attendance.find({
        employeeId,
        date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });
};

const getTodayAttendance = async (employeeId) => {
    const today = getISTDate();
    return await Attendance.findOne({ employeeId, date: today });
};

module.exports = {
    checkIn,
    checkOut,
    startBreak,
    endBreak,
    getAttendanceRecords,
    getAttendanceByDateRange,
    getTodayAttendance
};
