const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const departmentCodes = {
    developer: "DEV",
    manager: "MNG",
    employee: "EMP",
    hr: "HR",
    admin: "ADM",
    tester: "TST"
};

function getDepartmentCode(department) {
    return departmentCodes[department.toLowerCase()] || "GEN";
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        uppercase: true,
        trim: true
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
        minlength: 6,
        select: false
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'idle', 'banned'],
        default: 'active',
        lowercase: true
    },
    role: {
        type: String,
        enum: ['admin', 'manager', 'employee', 'hr', 'tester'],
        default: 'employee',
        lowercase: true
    },
    department: {
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
    team: {
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
    },
    salary: {
        base: { type: Number, default: 0 },
        bonus: { type: Number, default: 0 },
        deductions: { type: Number, default: 0 },
        currency: { type: String, default: 'INR' }
    },
    bankDetails: {
        bankName: { type: String },
        accountNumber: { type: String, select: false },
        ifscCode: { type: String }
    },
    address: {
        current: {
            street: String,
            city: String,
            state: String,
            country: String,
            postalCode: String
        },
        permanent: {
            street: String,
            city: String,
            state: String,
            country: String,
            postalCode: String
        },
        workLocation: {
            type: String,
            enum: ['Office', 'Remote', 'Hybrid'],
            default: 'Office'
        }
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

userSchema.pre('save', async function() {
    if (this.isNew && !this.username) {
        const deptCode = getDepartmentCode(this.department);
        const year = new Date().getFullYear();
        
        const lastEmployee = await mongoose.model('User').findOne({
            username: new RegExp(`^${deptCode}-${year}-`)
        }).sort({ username: -1 });
        
        let sequence = 1;
        if (lastEmployee && lastEmployee.username) {
            const lastSeq = parseInt(lastEmployee.username.split('-')[2]);
            sequence = lastSeq + 1;
        }
        
        this.username = `${deptCode}-${year}-${String(sequence).padStart(3, '0')}`;
    }
    
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.set('toJSON', {
    transform: function(doc, ret) {
        delete ret.password;
        return ret;
    }
});

userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
