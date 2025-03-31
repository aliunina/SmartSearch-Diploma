import express from "express";
import userAuth from "../middleware/userAuth.js";
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
  signOutUser,
  isAuthentificated,
} from "../controller/userController.js";

const userRoute = express.Router();

userRoute.post("/register", registerUser);
userRoute.post("/authorize", authorizeUser);
userRoute.get("/sign-out", signOutUser);
userRoute.get("/is-auth", userAuth, isAuthentificated);

userRoute.get("/all", getAllUsers);

userRoute.put("/update/:id", userAuth, updateUser);
userRoute.delete("/delete/:id", userAuth, deleteUser);

userRoute.get("/verify/:id/:uniqueString", verifyUser);
userRoute.get("/verified", verified);

userRoute.get("/recovery/:email", recoveryUser);
userRoute.post("/check-code/:email/:code", checkCode);
userRoute.put("/reset-password", resetPassword);

export default userRoute;
