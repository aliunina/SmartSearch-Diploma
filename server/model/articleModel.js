import mongoose from "mongoose";

const articleSchema = mongoose.Schema({
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
    theme: {
        type: String
    },
    snippet: {
        type: String
    },
    notification: {
        type: Boolean
    },
    createdAt: {
        type: Date
    }
});

export default mongoose.model("Article", articleSchema);