import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    phoneNumber: {
        type: String,
        required: true
    },
    bookings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking"
        }
    ],
    openBookings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking"
        }
    ],
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }
}, { timestamps: true });

// Virtual property to check if user is admin
userSchema.virtual('isAdmin').get(function() {
    return this.role === 'admin';
});

// Pre-save middleware to validate booking types
userSchema.pre('save', function(next) {
    if (this.role === 'user' && this.openBookings?.length > 0) {
        this.openBookings = [];
    }
    next();
});

const User = mongoose.model("User", userSchema);

export default User;