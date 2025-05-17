import express from "express";
import userAuth from "../middlewares/userAuth.js";
import { saveArticle, getArticles, deleteArticle } from "../controllers/articleController.js";

const articleRoute = express.Router();

articleRoute.get("/get-articles", userAuth, getArticles);
articleRoute.post("/save", userAuth, saveArticle);
articleRoute.post("/delete", userAuth, deleteArticle);

export default articleRoute;
