import express from "express";
import {createUser, deleteUser, getAllUsers, getUserByCredentials, getUserById, updateUser} from "../controller/userController.js";

const userRoute = express.Router();

userRoute.post("/register/user", createUser);
userRoute.get("/users", getAllUsers);
userRoute.get("/user/:id", getUserById);
userRoute.post("/authorize/user", getUserByCredentials);
userRoute.put("/update/user/:id", updateUser);
userRoute.delete("/delete/user/:id", deleteUser);

export default userRoute;  