import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoute from "./routes/userRoute.js";
import articleRoute from "./routes/articleRoute.js";
import notificationRoute from "./routes/notificationRoute.js";
import fileRoute from "./routes/fileRoute.js";

import "./jobs/sendNotificationByEmailJob.js";
import "./jobs/deleteNotificationJob.js";

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({origin: true, credentials: true }));
dotenv.config();

const PORT = process.env.PORT || 7000;
const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("DB connected.");
    app.listen(PORT, () => {
      console.log(`Server is running on port = ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.use("/api/user", userRoute);
app.use("/api/article", articleRoute);
app.use("/api/notification", notificationRoute);
app.use("/api/file", fileRoute);
