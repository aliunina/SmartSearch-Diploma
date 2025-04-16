import express from "express";
import userAuth from "../middleware/userAuth.js";
import { saveArticle, getArticles, deleteArticle } from "../controller/articleController.js";

const articleRoute = express.Router();

articleRoute.get("/get-articles", userAuth, getArticles);
articleRoute.post("/save", userAuth, saveArticle);
articleRoute.post("/delete", userAuth, deleteArticle);

export default articleRoute;
