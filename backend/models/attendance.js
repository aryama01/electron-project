const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    checkIn: {
        type: Date,
        default: null
    },
    checkOut: {
        type: Date,
        default: null
    },
    breaks: [{
        startTime: { type: Date, required: true },
        endTime: { type: Date, default: null },
        duration: { type: Number, default: 0 }
    }],
    totalWorkHours: {
        type: Number,
        default: 0
    },
    totalBreakTime: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['checked-in', 'on-break', 'checked-out', 'absent'],
        default: 'absent'
    }
}, { timestamps: true });

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
