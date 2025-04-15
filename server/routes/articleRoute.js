import express from "express";
import userAuth from "../middleware/userAuth.js";
import { saveArticle, getArticles, deleteArticleFromLibrary } from "../controller/articleController.js";

const articleRoute = express.Router();

articleRoute.get("/get-articles", userAuth, getArticles);
articleRoute.post("/save-to-library", userAuth, saveArticle);
articleRoute.post("/delete-article-from-library", userAuth, deleteArticleFromLibrary);

export default articleRoute;
