const attendanceService = require('../services/attendance.service');

const checkIn = async (req, res) => {
    try {
        const employeeId = req.user.id;
        const attendance = await attendanceService.checkIn(employeeId);
        res.status(200).json({ message: "Checked in successfully", attendance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const checkOut = async (req, res) => {
    try {
        const employeeId = req.user.id;
        const attendance = await attendanceService.checkOut(employeeId);
        res.status(200).json({ message: "Checked out successfully", attendance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const startBreak = async (req, res) => {
    try {
        const employeeId = req.user.id;
        const attendance = await attendanceService.startBreak(employeeId);
        res.status(200).json({ message: "Break started", attendance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const endBreak = async (req, res) => {
    try {
        const employeeId = req.user.id;
        const attendance = await attendanceService.endBreak(employeeId);
        res.status(200).json({ message: "Break ended", attendance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAttendance = async (req, res) => {
    try {
        const employeeId = req.query.employeeId || req.user.id;
        const { date, page = 1, limit = 10 } = req.query;
        
        const result = await attendanceService.getAttendanceRecords(
            employeeId, 
            date, 
            parseInt(page), 
            parseInt(limit)
        );
        
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { checkIn, checkOut, startBreak, endBreak, getAttendance };
