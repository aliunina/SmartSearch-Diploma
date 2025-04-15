import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getNotifications, saveNotification } from "../controller/notificationController.js";

const notificationRoute = express.Router();

notificationRoute.get("/get-notifications", userAuth, getNotifications);
notificationRoute.post("/save-to-library", userAuth, saveNotification);

export default notificationRoute;
