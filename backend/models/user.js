const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
    Id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    name: {
        type: String, // optional full name field
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'idle', 'banned'],
        default: 'active'
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ['admin', 'manager', 'employee'],
        default: 'employee'
    },
    team: {
        type: String,
        default: null
    },
    department: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null
    },
    joiningDate: {
        type: Date,
        default: null
    },
    profilePic: {
        type: String,
        default: null
    }
}, { timestamps: true }); // createdAt & updatedAt auto-managed


const User = mongoose.models.User || mongoose.model('User', userSchema);


module.exports = User;
