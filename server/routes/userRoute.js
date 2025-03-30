import express from "express";
import {
  authorizeUser,
  deleteUser,
  getAllUsers,
  registerUser,
  checkCode,
  recoveryUser,
  resetPassword,
  updateUser,
  verifyUser,
  verified,
} from "../controller/userController.js";

const userRoute = express.Router();

userRoute.post("/register/user", registerUser);
userRoute.post("/authorize/user", authorizeUser);

userRoute.get("/users", getAllUsers);

userRoute.put("/update/user/:id", updateUser);
userRoute.delete("/delete/user/:id", deleteUser);

userRoute.get("/verify/user/:id/:uniqueString", verifyUser);
userRoute.get("/verified", verified);

userRoute.get("/recovery/user/:email", recoveryUser);
userRoute.get("/recovery/check-code/:email/:code", checkCode);
userRoute.put("/recovery/reset-password", resetPassword);

export default userRoute;
