import express from "express";
import {createUser, deleteUser, getAllUsers, getUserByCredentials, getUserByEmail, updateUser, verifyUser, verified} from "../controller/userController.js";

const userRoute = express.Router();

userRoute.post("/register/user", createUser);
userRoute.post("/authorize/user", getUserByCredentials);

userRoute.get("/users", getAllUsers);
userRoute.get("/user/:email", getUserByEmail);

userRoute.put("/update/user/:id", updateUser);
userRoute.delete("/delete/user/:id", deleteUser);

userRoute.get("/verify/user/:id/:uniqueString", verifyUser);
userRoute.get("/verified", verified);

export default userRoute;  