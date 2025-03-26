import mongoose from "mongoose";

const userResetPasswordSchema = mongoose.Schema({
    userId: {
        type: String
    },
    resetCode: {
        type: String
    },
    createdAt: {
        type: Date
    },
    expiresAt: {
        type: Date
    }
});

export default mongoose.model("UserResetPassword", userResetPasswordSchema);