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
  changePassword,
  updateThemes,
} from "../controller/userController.js";
import { saveArticle, getArticles, deleteArticle } from "../controller/articleController.js";

const userRoute = express.Router();

userRoute.get("/all", getAllUsers);

userRoute.post("/register", registerUser);
userRoute.post("/authorize", authorizeUser);
userRoute.get("/sign-out", signOutUser);
userRoute.get("/is-auth", userAuth, isAuthentificated);

userRoute.put("/update", userAuth, updateUser);
userRoute.put("/change-password", userAuth, changePassword);
userRoute.put("/update-themes", userAuth, updateThemes);
userRoute.delete("/delete", userAuth, deleteUser);

userRoute.get("/verify/:id/:uniqueString", verifyUser);
userRoute.get("/verified", verified);

userRoute.get("/recovery/:email", recoveryUser);
userRoute.post("/check-code", checkCode);
userRoute.put("/reset-password", resetPassword);

userRoute.get("/get-articles", userAuth, getArticles);
userRoute.post("/save-to-library", userAuth, saveArticle);
userRoute.delete("/delete-article", userAuth, deleteArticle);

export default userRoute;
