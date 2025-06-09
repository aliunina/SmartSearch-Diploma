import express from "express";
import userAuth from "../middlewares/userAuth.js";
import { getNotifications, saveNotification } from "../controllers/notificationController.js";

const notificationRoute = express.Router();

notificationRoute.get("/get-notifications", userAuth, getNotifications);
notificationRoute.post("/save-to-library", userAuth, saveNotification);

export default notificationRoute;
