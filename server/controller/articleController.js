import dotenv from "dotenv";

import User from "../model/userModel.js";
import Article from "../model/articleModel.js";

dotenv.config();

export const saveArticle = async (req, res) => {
  try {
    const id = req.body.userId;
    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).json({
        errorMessage: "User not found.",
      });
    }

    const articleExists = await Article.find({
      $and: [
        {
          link: req.body.link,
        },
        {
          title: req.body.title,
        },
        {
          notification: false,
        },
        {
          userId: id,
        },
      ],
    });
    if (articleExists.length > 0) {
      return res.status(409).json({
        errorMessage: "Article has been already added.",
      });
    }

    const userArticles = await Article.find({
      $and: [
        {
          notification: false,
        },
        {
          userId: id,
        },
      ],
    });
    if (userArticles.length === 50) {
      return res.status(429).json({
        errorMessage:
          "Too many articles in library. Please, delete one to proceed.",
      });
    }

    const newArticle = new Article({
      userId: id,
      link: req.body.link,
      displayLink: req.body.displayLink,
      title: req.body.title,
      theme: null,
      snippet: req.body.snippet,
      notification: false,
      createdAt: new Date(),
    });

    const savedData = await newArticle.save();
    res.status(200).json(savedData);
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
    });
  }
};

export const getArticles = async (req, res) => {
  try {
    const id = req.body.userId;
    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).json({
        errorMessage: "User not found.",
      });
    }

    const articles = await Article.find({
      $and: [
        {
          notification: false,
        },
        {
          userId: id,
        },
      ],
    })
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
    });
  }
};

export const deleteArticleFromLibrary = async (req, res) => {
  try {
    const userId = req.body.userId;
    const articleId = req.body.articleId;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        errorMessage: "User not found.",
      });
    }

    const articleExists = await Article.findById(articleId);
    if (!articleExists) {
      return res.status(404).json({
        errorMessage: "Article not found.",
      });
    }

    await Article.findByIdAndDelete(articleId);
    const articles = await Article.find({
      $and: [
        {
          notification: false,
        },
        { userId },
      ],
    })
      .sort({ createdAt: -1 })
      .exec();
    res.status(200).json({
      message: `Article with id '${articleId}' has been deleted.`,
      articles: articles ? articles : []
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
    });
  }
};
