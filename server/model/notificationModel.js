import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
    userId: {
        type: String
    },
    link: {
        type: String
    },
    displayLink: {
        type: String
    },
    title: {
        type: String
    },
    snippet: {
        type: String
    },
    createdAt: {
        type: Date
    }
});

export default mongoose.model("Notification", notificationSchema);