const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'banned'],
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
    phone: {
        type: String,
        default: null
    },
    profilePic: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});


// Update updatedAt on save
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
