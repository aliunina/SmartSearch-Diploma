import mongoose from "mongoose";

const userSessionSchema = mongoose.Schema({
    userId: {
        type: String
    },
    verifyOtp: {
        type: String, 
        default: ""
    },
    verifyOtpExpiresAt: {
        type: Number,
        default: 0
    },
    resetOtp: {
        type: String, 
        default: ""
    },
    resetOtpExpiresAt: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date
    }
});

export default mongoose.model("UserSession", userSessionSchema);