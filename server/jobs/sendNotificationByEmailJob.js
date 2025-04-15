import cron from "node-cron";
import nodemailer from "nodemailer";
import axios from "axios";
import fs from "fs";

import User from "../model/userModel.js";
import Notification from "../model/notificationModel.js";

const cronExpression = "0 9 1,15 * *"; //работает в 9 утра каждого 1го и 15го числа месяца

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
    const notifiedUsers = await User.find({
      $and: [
        {
          themes: { $ne: [] },
        },
        {
          verified: true,
        },
      ],
    });
    notifiedUsers.forEach(async (user) => {
      const { _id, email, firstName } = user;
      let htmlArticles = "";
      const notificationsToSave = [];
      const themesToSave = [];

      const themePromises = user.themes.map(async (theme) => {
        const { notificationArticles, recentArticles } =
          await getNotificationArticles(theme);
        themesToSave.push({
          text: theme.text,
          recentArticles,
        });
        if (notificationArticles.length > 0) {
          htmlArticles += `<p style="font-size: medium;">Эти статьи на тему <b>"${theme.text}"</b> могут быть вам интересны:</p>`;

          notificationArticles.forEach((article) => {
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

            const newNotification = new Notification({
              userId: _id,
              link: article.link,
              theme: theme.text,
              title: article.title,
              displayLink: article.displayLink,
              snippet: article.snippet,
              createdAt: Date.now(),
            });
            notificationsToSave.push(newNotification);
          });
        }
      });

      await Promise.all(themePromises);

      if (notificationsToSave.length > 0) {
        sendNotificationEmail(_id, email, firstName, htmlArticles);
        await Notification.create(notificationsToSave);

        const updatedData = await User.findByIdAndUpdate(
          _id,
          { themes: themesToSave },
          { new: true }
        );
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const getNotificationArticles = async (theme) => {
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

    let notificationArticles = [];
    if (theme.recentArticles.length !== 0) {
      const newArticles = response.data.items.slice(0, 3);

      newArticles.forEach((newArticle) => {
        if (
          !theme.recentArticles.find(
            (oldArticle) =>
              newArticle.link === oldArticle.link &&
              newArticle.title === oldArticle.title
          )
        ) {
          notificationArticles.push(newArticle);
        }
      });
    } else {
      notificationArticles = response.data.items.slice(0, 3);
    }
    return {
      notificationArticles,
      recentArticles: response.data.items.slice(0, 3),
    };
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

cron.schedule(cronExpression, () => {
  console.log("job is running");
  sendNotifications();
});
