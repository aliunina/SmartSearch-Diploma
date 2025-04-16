import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  authorizeUser,
  deleteUser,
  registerUser,
  checkCode,
  recoveryUser,
  resetPassword,
  updateUser,
  verifyUser,
  verified,
  signOutUser,
  isAuthentificated,
  updatePassword,
  updateThemes,
} from "../controller/userController.js";

const userRoute = express.Router();

userRoute.post("/register", registerUser);
userRoute.post("/authorize", authorizeUser);
userRoute.get("/sign-out", signOutUser);
userRoute.get("/is-auth", userAuth, isAuthentificated);

userRoute.put("/update", userAuth, updateUser);
userRoute.put("/update-password", userAuth, updatePassword);
userRoute.put("/update-themes", userAuth, updateThemes);
userRoute.post("/delete", userAuth, deleteUser);

userRoute.get("/verify/:id/:uniqueString", verifyUser);
userRoute.get("/verified", verified);

userRoute.get("/recovery/:email", recoveryUser);
userRoute.post("/check-code", checkCode);
userRoute.put("/reset-password", resetPassword);

export default userRoute;
