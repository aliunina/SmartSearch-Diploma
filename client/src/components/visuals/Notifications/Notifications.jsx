import "./Notifications.css";

import SearchResults from "../SearchResults/SearchResults";
import BusyIndicator from "../BusyIndicator/BusyIndicator";

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../../contexts/UserContext/UserContext";
import {
  showErrorMessageToast,
  showSuccessMessageToast
} from "../../../helpers/util";

export default function Notifications() {
  const { user } = useContext(UserContext);

  const [notifications, setNotifications] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user !== null) {
      setBusy(true);
      const serverUrl = import.meta.env.VITE_SERVER_API_URL;
      axios
        .get(serverUrl + "/notification/get-notifications", {
          withCredentials: true
        })
        .then((response) => {
          if (response.status === 200 && response.data) {
            setNotifications(response.data);
          } else {
            setNotifications([]);
          }
          setBusy(false);
        })
        .catch((response) => {
          console.log(response.data);
          if (response.status === 404) {
            showErrorMessageToast(
              "Попытка обращения к несуществующему пользователю."
            );
          } else if (response.status === 401) {
            showErrorMessageToast(
              "Вы не авторизованы. Пожалуйста, выполните вход."
            );
          }
          setBusy(false);
        });
    }
  }, [user]);

  if (busy) {
    return (
      <div className="notifications-busy-container">
        <BusyIndicator removeClasses={true} />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="empty-container">
        <img
          src="no_search_results.svg"
          className="empty-image"
          alt="Нет результатов"
        />
        <p className="empty-text">Пока нет новых статей по интересующим вас областям.</p>
      </div>
    );
  }

  const handleSaveNotification = (article) => {
    setBusy(true);
    const serverUrl = import.meta.env.VITE_SERVER_API_URL;
    axios
      .post(serverUrl + "/notification/save-notification-to-library", article, {
        withCredentials: true
      })
      .then((response) => {
        if (response.status === 200) {
          showSuccessMessageToast(
            "Статья успешно сохранена в вашей библиотеке."
          );
        } else {
          showErrorMessageToast("Произошла ошибка, попробуйте еще раз.");
        }
        setNotifications(response.data.notifications);
        setBusy(false);
      })
      .catch((response) => {
        console.log(response.data);
        if (response.status === 404) {
          showErrorMessageToast(
            "Попытка обращения к несуществующему пользователю."
          );
        } else if (response.status === 401) {
          showErrorMessageToast(
            "Вы не авторизованы. Пожалуйста, выполните вход."
          );
        } else if (response.status === 409) {
          showErrorMessageToast("Статья уже сохранена в вашей библиотеке.");
        } else if (response.status === 429) {
          showErrorMessageToast(
            "Библиотека переполнена. Пожалуйста, удалите одну из статей в библиотеке, чтобы продолжить."
          );
        } else {
          showErrorMessageToast("Произошла ошибка, попробуйте позже.");
        }
        setBusy(false);
      });
  };

  return (
    <div className="notifications">
      {notifications.length > 0 &&
        user.themes.map((theme) => {
          const themeNotifications = notifications.filter(
            (notification) => notification.theme === theme.text
          );
          if (themeNotifications?.length > 0) {
            return (
              <div className="theme-notifications" key={theme.text}>
                <div className="theme-notifications-title">{`Новые статьи на тему «${theme.text}»`}</div>
                <SearchResults
                  items={themeNotifications}
                  hideDeleteButton={true}
                  hideSaveButton={false}
                  hidePages={true}
                  saveArticle={handleSaveNotification}
                />
              </div>
            );
          } else return <div key={theme.text}></div>;
        })}
    </div>
  );
}
