import mongoose from "mongoose";

const userResetPasswordSchema = mongoose.Schema({
    userId: {
        type: String
    },
    resetString: {
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