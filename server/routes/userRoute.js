import express from "express";
import {createUser, deleteUser, getAllUsers, getUserByCredentials, getUserById, updateUser} from "../controller/userController.js";

const route = express.Router();

route.post("/register/user", createUser);
route.get("/users", getAllUsers);
route.get("/user/:id", getUserById);
route.post("/authorize/user", getUserByCredentials);
route.put("/update/user/:id", updateUser);
route.delete("/delete/user/:id", deleteUser);

export default route;  