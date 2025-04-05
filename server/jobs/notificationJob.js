import cron from "node-cron";
import nodemailer from "nodemailer";
import axios from "axios";
import fs from "fs";

import User from "../model/userModel.js";
import Article from "../model/articleModel.js";

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

const sendNotifications = async (req, res) => {
  try {
    const notifiedUsers = await User.find({ themes: { $ne: [] } });
    notifiedUsers.forEach(async (user) => {
      const { _id, email, firstName } = user;
      let htmlArticles = "";
      const articlesToSave = [];
      const length = user.themes.length;

      user.themes.forEach(async (theme, i) => {
        getNewArticles(theme).then((articles) => {
          if (articles.length > 0) {
            htmlArticles += `<p style="font-size: medium;">Эти статьи на тему <b>"${theme.text}"</b> могут быть вам интересны:</p>`;

            articles.forEach((article) => {
              const newArticle = new Article({
                userId: _id,
                link: article.link,
                theme: theme.text,
                title: article.title,
                displayLink: article.displayLink,
                snippet: article.snippet,
                newArticle: true,
                createdAt: Date.now(),
              });
              articlesToSave.push(newArticle);
              htmlArticles += `
                    <div style="padding-bottom: 2em;">
                      <a
                        style="
                          margin: 0;
                          font-weight: 500;
                          font-size: 1.2em;
                          text-decoration: none;
                          color: #1155cc;
                        "
                        target="_blank"
                        href="${article.link}"
                        >${article.title}</a
                      >
                      <div>
                      <a
                        style="margin: 0; text-decoration: none; color: #008054"
                        target="_blank"
                        href="${article.link}"
                        >${article.displayLink}</a
                      ></div>
                      <div>${article.snippet}</div>
                    </div>`;
            });
          }

          if (i === length - 1) {
            sendNotificationEmail(_id, email, firstName, htmlArticles);
            Article.create(articlesToSave);
          }
        });
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
      sort: "date",
    });

    const response = await axios.get(
      `${process.env.SEARCH_ENGINE_URL}?${urlParams.toString()}`
    );
    const newArticlesCount =
      (response.data.searchInformation.totalResults - theme.count) % 10;

    console.log(
      "Статей по теме " +
        theme.text +
        ": " +
        response.data.searchInformation.totalResults
    );

    const articles = [];
    for (let i = 0; i < newArticlesCount; i++) {
      articles.push(response.data.items[i]);
    }
    return articles;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const sendNotificationEmail = (id, email, name, htmlArticles) => {
  const templatePath = "./templates/notificationTemplate.html";
  let htmlTemplate = fs.readFileSync(templatePath, "utf-8");

  const emailContent = htmlTemplate
    .replace("{{name}}", name)
    .replace("{{articles}}", htmlArticles);

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Новые статьи по избранным темам",
    html: emailContent,
  };

  transporter
    .sendMail(mailOptions)
    .then(() => {
      console.log("Notification email sent.");
    })
    .catch((error) => {
      console.log("An error occured while sending notification email.");
      console.log(error);
    });
};

// sendNotifications();

// cron.schedule(cronExpression, () => {
//   console.log("job is running");
//   sendNotifications();
// });
