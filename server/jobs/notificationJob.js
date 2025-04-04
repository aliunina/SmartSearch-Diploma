import cron from "node-cron";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import axios from "axios";

import User from "../model/userModel.js";

const cronExpression = "*/1 * * * *";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to send notifications.");
  }
});

// cron.schedule(cronExpression, () => {
//   console.log("job is running");
//   sendNotifications();
// });

const sendNotifications = async (req, res) => {
  try {
    const notifiedUsers = await User.find({ themes: { $ne: [] } });
    notifiedUsers.forEach((user) => {
      user.themes.forEach((theme) => {
        const articles = getNewArticles(theme);
        sendNotificationEmail(user, theme.text, articles);
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const getNewArticles = async (theme) => {
  try {
    const urlParams = new URLSearchParams({
      cx: process.env.SEARCH_ENGINE_CX,
      key: process.env.SEARCH_ENGINE_KEY,
      q: theme.text,
      sort: date,
    });

    const response = await axios.get(
      `${process.env.SEARCH_ENGINE_URL}?${urlParams.toString()}`
    );
    const newArticlesCount =
      response.data.searchInformation.totalResults - theme.count;

    console.log(
      "Статей по теме " +
        theme.text +
        ": " +
        response.data.searchInformation.totalResults
    );

    const articles = [];
    for (i = 0; i < newArticlesCount; i++) {
      articles.push(response.data.items);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const sendNotificationEmail = (user, theme, articles) => {
  const templatePath = path.resolve("templates/notificationTemplate.html");
  let htmlTemplate = fs.readFileSync(templatePath, "utf-8");

  let htmlArticles;
  articles.forEach((article) => {
    htmlArticles += `
        <div class="article-container">
            <a class="article-title" target="_blank" href="${article.link}">${article.title}</a>
            <a class="article-site" target="_blank" href="${article.link}">${article.displayLink}</a>
            <p class="article-snippet">${article.snippet}</p>
        </div>`;
  });

  const emailContent = htmlTemplate
    .replace("{{name}}", user.name)
    .replace("{{theme}}", theme)
    .replace("{{articles}}", htmlArticles);

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: user.email,
    subject: "Новые статьи по теме",
    html: emailContent,
  };

  transporter
    .sendMail(mailOptions)
    .then(() => {
      return res.status(200).json({
        message: "Notification email sent.",
      });
    })
    .catch((error) => {
      return res.status(500).json({
        errorMessage: "An error occured while sending notification email.",
      });
    });
};

sendNotifications();
