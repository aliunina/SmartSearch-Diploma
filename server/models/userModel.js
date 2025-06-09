import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  lastName: {
    type: String,
    maxlength: 50,
    required: true,
  },
  firstName: {
    type: String,
    maxlength: 50,
    required: true,
  },
  patronymic: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    maxlength: 100,
    match:
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu,
    required: true,
  },
  password: {
    type: String,
    match: /[0-9a-zA-Z!@#$%^&*]{8,65}/,
    required: true,
  },
  country: {
    type: String,
    maxlength: 50,
    required: true,
  },
  employment: {
    type: String,
    maxlength: 100,
    required: true,
  },
  themes: {
    type: Array,
    validate: [
      function arrayLimit(val) {
        return val.length <= 5;
      },
      "{PATH} exceeds the limit of 5",
    ],
  },
  status: {
    type: String,
    maxlength: 50,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

export default mongoose.model("User", userSchema);
