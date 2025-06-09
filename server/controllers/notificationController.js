import dotenv from "dotenv";

import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";
import Article from "../models/articleModel.js";

dotenv.config();

export const getNotifications = async (req, res) => {
  try {
    const id = req.body.userId;
    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).json({
        errorMessage: "User not found.",
      });
    }

    const notifications = await Notification.find({
      userId: id,
    })
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
    });
  }
};

export const saveNotification = async (req, res) => {
  try {
    const userId = req.body.userId;

    const userExists = await User.findById(userId);
    if (!userExists) {
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
        { userId },
      ],
    });
    if (articleExists.length > 0) {
      return res.status(409).json({
        errorMessage: "Article has been already added.",
      });
    }

    const userArticles = await Article.find({
      userId,
    });
    if (userArticles.length === 50) {
      return res.status(429).json({
        errorMessage:
          "Too many articles in library. Please, delete one to proceed.",
      });
    }

    const newArticle = new Article({
      userId,
      link: req.body.link,
      displayLink: req.body.displayLink,
      title: req.body.title,
      snippet: req.body.snippet,
      createdAt: new Date(),
    });
    newArticle.save();

    await Notification.findByIdAndDelete(req.body._id);
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .exec();
    res.status(200).json({
      message: `Notification was saved to library.`,
      notifications: notifications ? notifications : [],
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
    });
  }
};
