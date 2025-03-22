import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    lastName: {
        type: String,
        maxlength: 50,
        required: true
    },
    firstName: {
        type: String,
        maxlength: 50,
        required: true
    },
    patronymic: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        maxlength: 100,
        match: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu,
        required: true
    },
    password: {
        type: String,
        match: /[0-9a-zA-Z!@#$%^&*]{8,50}/,
        required: true
    },
    country: {
        type: String,
        maxlength: 50,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    employment: {
        type: String,
        maxlength: 100,
        required: true
    },
    themes: {
        type: Array
    },
    status: {
        type: String,
        maxlength: 50
    }
});

export default mongoose.model("User", userSchema);