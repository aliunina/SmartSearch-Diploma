import cron from "node-cron";

import Notification from "../model/notificationModel.js";

const cronExpression = "0 0 1 * *"; //работает каждый 1-й день месяца

const deleteNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({});

    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    notifications.forEach(async notification => {
      if (notification.createdAt <= twoMonthsAgo) {
        await Notification.findByIdAndDelete(notification._id);
        console.log(`Notification with id ${notification._id} has been deleted.`);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

cron.schedule(cronExpression, () => {
  console.log("job is running");
  deleteNotifications();
});
