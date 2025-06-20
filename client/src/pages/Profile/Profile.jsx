import "./Profile.css";

import Body from "../../layouts/SearchLayout/Body/Body";
import Header from "../../layouts/CommonLayout/Header/Header";
import UpperPanel from "../../layouts/ProfileLayout/UpperPanel/UpperPanel";
import LowerPanel from "../../layouts/ProfileLayout/LowerPanel/LowerPanel";

import Avatar from "../../components/visuals/Avatar/Avatar";
import Logo from "../../components/visuals/Logo/Logo";
import EditProfileDialog from "../../components/dialogs/EditProfileDialog/EditProfileDialog";
import EditPasswordDialog from "../../components/dialogs/EditPasswordDialog/EditPasswordDialog";
import Button from "../../components/inputs/Button/Button";
import EditThemesDialog from "../../components/dialogs/EditThemesDialog/EditThemesDialog";
import Library from "../../components/visuals/Library/Library";

import {
  showErrorMessageToast,
  showSuccessMessageToast
} from "../../helpers/util";

import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { UserContext } from "../../contexts/UserContext/UserContext";
import Notifications from "../../components/visuals/Notifications/Notifications";
import ConfirmDialog from "../../components/dialogs/ConfirmDialog/ConfirmDialog";
import Footer from "../../layouts/CommonLayout/Footer/Footer";

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, setUser } = useContext(UserContext);

  const [tab, setTab] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [profileDialogState, setProfileDialogState] = useState(user);
  const [profileDialogBusy, setProfileDialogBusy] = useState(false);

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const INITIAL_PASSWORD_DIALOG_STATE = {
    oldPassword: "",
    newPassword: "",
    repeatPassword: ""
  };
  const [passwordDialogState, setPasswordDialogState] = useState(
    INITIAL_PASSWORD_DIALOG_STATE
  );
  const [passwordDialogBusy, setPasswordDialogBusy] = useState(false);

  const [themesDialogOpen, setThemesDialogOpen] = useState(false);
  const [themesDialogState, setThemesDialogState] = useState(null);
  const [themesDialogBusy, setThemesDialogBusy] = useState(false);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogState, setConfirmDialogState] = useState({
    text: "",
    title: "",
    confirmButtonType: "",
    confirmButtonText: "",
    data: {}
  });
  const [confirmDialogBusy, setConfirmDialogBusy] = useState(false);

  useEffect(() => {
    if (user === null && profileDeleted.current === false) {
      navigate("/sign-in", {
        state: {
          navBack: true
        }
      });
    }
  }, [user, navigate]);

  useEffect(() => {
    setTab(location.state?.tab ? location.state.tab : 0);
  }, [location]);

  const editUserProfile = () => {
    const state = { ...user };
    setProfileDialogState(state);
    setProfileDialogOpen(true);
  };

  const updateUser = (values) => {
    setProfileDialogBusy(true);
    const serverUrl = import.meta.env.VITE_SERVER_API_URL;
    axios
      .put(serverUrl + "/user/update", values, {
        withCredentials: true
      })
      .then((response) => {
        if (response.status === 200 && response.data) {
          setUser(response.data);
          showSuccessMessageToast("Данные успешно обновлены.");
          setProfileDialogOpen(false);
        } else {
          showErrorMessageToast("Произошла ошибка, попробуйте еще раз.");
        }
        setProfileDialogBusy(false);
      })
      .catch((response) => {
        console.log(response.data);
        if (response.status === 404) {
          showErrorMessageToast(
            "Попытка редактирования несуществующего пользователя."
          );
        } else if (response.status === 401) {
          showErrorMessageToast(
            "Вы не авторизованы. Пожалуйста, выполните вход."
          );
        } else {
          showErrorMessageToast("Произошла ошибка, попробуйте еще раз.");
        }
        setProfileDialogBusy(false);
      });
  };

  const openPasswordDialog = () => {
    setPasswordDialogState(INITIAL_PASSWORD_DIALOG_STATE);
    setPasswordDialogOpen(true);
  };

  const editPassword = (values) => {
    setPasswordDialogBusy(true);
    const serverUrl = import.meta.env.VITE_SERVER_API_URL;
    axios
      .put(serverUrl + "/user/update-password", values, {
        withCredentials: true
      })
      .then((response) => {
        if (response.status === 200 && response.data) {
          showSuccessMessageToast("Пароль успешно изменен.");
          setPasswordDialogOpen(false);
        } else {
          showErrorMessageToast("Произошла ошибка, попробуйте еще раз.");
        }
        setPasswordDialogBusy(false);
      })
      .catch((response) => {
        console.log(response.data);
        if (response.status === 404) {
          showErrorMessageToast(
            "Попытка редактирования несуществующего пользователя."
          );
        } else if (response.status === 401) {
          showErrorMessageToast(
            "Вы не авторизованы. Пожалуйста, выполните вход."
          );
        } else if (response.status === 403) {
          showErrorMessageToast("Неверный текущий пароль.");
        } else if (response.status === 400) {
          showErrorMessageToast("Новый пароль не может быть равен старому.");
        } else {
          showErrorMessageToast("Произошла ошибка, попробуйте еще раз.");
        }
        setPasswordDialogBusy(false);
      });
  };

  const editUserThemes = () => {
    if (user !== null) {
      setThemesDialogState({ themes: [...user.themes] });
    }
    setThemesDialogOpen(true);
  };

  const updateThemes = (themes) => {
    setThemesDialogBusy(true);
    const serverUrl = import.meta.env.VITE_SERVER_API_URL;
    axios
      .put(
        serverUrl + "/user/update-themes",
        { themes },
        {
          withCredentials: true
        }
      )
      .then((response) => {
        if (response.status === 200 && response.data) {
          setUser(response.data.user);
          setNotifications(response.data.notifications);
          showSuccessMessageToast("Области интересов успешно изменены.");
          setThemesDialogOpen(false);
        } else {
          showErrorMessageToast("Произошла ошибка, попробуйте еще раз.");
        }
        setThemesDialogBusy(false);
      })
      .catch((response) => {
        console.log(response.data);
        if (response.status === 404) {
          showErrorMessageToast(
            "Попытка редактирования несуществующего пользователя."
          );
        } else if (response.status === 401) {
          showErrorMessageToast(
            "Вы не авторизованы. Пожалуйста, выполните вход."
          );
        } else {
          showErrorMessageToast("Произошла ошибка, попробуйте еще раз.");
        }
        setThemesDialogBusy(false);
      });
  };

  const deleteUser = () => {
    setConfirmDialogOpen(true);
    setConfirmDialogState({
      isLoading: false,
      text: "Вы действительно хотите удалить свой профиль?",
      title: "Подтвердите удаление профиля",
      confirmButtonType: "delete",
      confirmButtonText: "Удалить"
    });
  };

  const profileDeleted = useRef(false);
  const handleConfirmDialogClose = (choice) => {
    if (choice === "confirm") {
      setConfirmDialogBusy(true);
      const serverUrl = import.meta.env.VITE_SERVER_API_URL;
      axios
        .post(
          serverUrl + "/user/delete",
          {},
          {
            withCredentials: true
          }
        )
        .then((response) => {
          if (response.status === 200 && response.data) {
            showSuccessMessageToast("Ваш профиль был успешно удален.");
            profileDeleted.current = true;
            setUser(null);
            navigate("/");
          } else {
            showErrorMessageToast("Произошла ошибка, попробуйте еще раз.");
          }
          setConfirmDialogBusy(false);
        })
        .catch((response) => {
          if (response.status === 404) {
            showErrorMessageToast(
              "Попытка редактирования несуществующего пользователя."
            );
          } else if (response.status === 401) {
            showErrorMessageToast(
              "Вы не авторизованы. Пожалуйста, выполните вход."
            );
          } else {
            showErrorMessageToast("Произошла ошибка, попробуйте еще раз.");
          }
          setConfirmDialogBusy(false);
        });
    } else {
      setConfirmDialogOpen(false);
    }
  };

  return (
    <div className="profile-root">
      {user && (
        <>
          <Header>
            <Link to="/">
              <Logo className="header-logo" />
            </Link>
            {confirmDialogOpen && (
              <ConfirmDialog
                dialogBusy={confirmDialogBusy}
                dialogOpen={confirmDialogOpen}
                setDialogOpen={setConfirmDialogOpen}
                dialogClose={handleConfirmDialogClose}
                text={confirmDialogState.text}
                title={confirmDialogState.title}
                confirmButtonText={confirmDialogState.confirmButtonText}
                confirmButtonType={confirmDialogState.confirmButtonType}
                data={confirmDialogState.data}
              />
            )}
            {profileDialogOpen && (
              <EditProfileDialog
                dialogState={profileDialogState}
                dialogBusy={profileDialogBusy}
                setDialogOpen={setProfileDialogOpen}
                setDialogState={setProfileDialogState}
                updateUser={updateUser}
                deleteUser={deleteUser}
              />
            )}
            {passwordDialogOpen && (
              <EditPasswordDialog
                dialogState={passwordDialogState}
                dialogBusy={passwordDialogBusy}
                setDialogOpen={setPasswordDialogOpen}
                setDialogState={setPasswordDialogState}
                editPassword={editPassword}
              />
            )}
            {themesDialogOpen && (
              <EditThemesDialog
                dialogState={themesDialogState}
                dialogBusy={themesDialogBusy}
                setDialogOpen={setThemesDialogOpen}
                setDialogState={setThemesDialogState}
                updateThemes={updateThemes}
              />
            )}
          </Header>
          <Body>
            <UpperPanel>
              <Avatar size={"11em"} title="Профиль" />
              <div className="profile-user-details">
                <div className="profile-user-name-edit-button">
                  <p className="profile-user-name">
                    {user.lastName} {user.firstName} {user.patronymic}
                  </p>
                  <Button
                    className="profile-edit-button transparent-button"
                    onClick={editUserProfile}
                  >
                    <img src="edit-profile.svg" alt="Изменить профиль" />
                    Изменить профиль
                  </Button>
                  <Button
                    className="profile-change-password-button transparent-button"
                    onClick={openPasswordDialog}
                  >
                    Изменить пароль
                  </Button>
                </div>
                <p className="profile-user-employment">{user.employment}</p>
                <div>
                  <p className="profile-user-themes-title">Области интересов</p>
                  <div className="profile-edit-themes-container">
                    {user.themes?.length > 0 && (
                      <div className="profile-user-themes">
                        {user.themes?.map((theme, i) => {
                          return (
                            <div className="profile-user-theme" key={i}>
                              {theme.text}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <Button
                      className={`default-button profile-edit-themes-button ${
                        user.themes?.length === 0
                          ? "profile-edit-themes-button-outlined"
                          : ""
                      }`}
                      title="Редактировать области интересов"
                      onClick={editUserThemes}
                    >
                      <img src="edit-profile.svg" alt="Редактировать" />
                      {user.themes?.length === 0 && <span>Добавить</span>}
                    </Button>
                  </div>
                </div>
              </div>
            </UpperPanel>
            <LowerPanel>
              <div className="profile-tabs">
                <p
                  className={`${
                    tab === 0 ? "profile-tab profile-tab-active" : "profile-tab"
                  }`}
                  onClick={() => setTab(0)}
                >
                  <svg
                    width="21"
                    height="19"
                    viewBox="0 0 21 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.325 19L5.95 11.975L0.5 7.25003L7.7 6.62503L10.5 3.05176e-05L13.3 6.62503L20.5 7.25003L15.05 11.975L16.675 19L10.5 15.275L4.325 19Z"
                      fill={`${
                        tab === 0
                          ? "var(--accent-green)"
                          : "var(--gray-text-color)"
                      }`}
                    />
                  </svg>
                  Моя библиотека
                </p>
                <p
                  className={`${
                    tab === 1 ? "profile-tab profile-tab-active" : "profile-tab"
                  }`}
                  onClick={() => setTab(1)}
                >
                  <svg
                    width="21"
                    height="19"
                    viewBox="0 0 21 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.5 9.00003L5.5 3.05176e-05L10.5 9.00003H0.5ZM5.5 19C4.4 19 3.45833 18.6084 2.675 17.825C1.89167 17.0417 1.5 16.1 1.5 15C1.5 13.9 1.89167 12.9584 2.675 12.175C3.45833 11.3917 4.4 11 5.5 11C6.6 11 7.54167 11.3917 8.325 12.175C9.10833 12.9584 9.5 13.9 9.5 15C9.5 16.1 9.10833 17.0417 8.325 17.825C7.54167 18.6084 6.6 19 5.5 19ZM11.5 19V11H19.5V19H11.5ZM15.5 9.00003C14.55 8.20003 13.754 7.52503 13.112 6.97503C12.47 6.42503 11.9577 5.9417 11.575 5.52503C11.1917 5.10836 10.9167 4.7167 10.75 4.35003C10.5833 3.98336 10.5 3.5917 10.5 3.17503C10.5 2.42503 10.7627 1.7917 11.288 1.27503C11.8133 0.758364 12.4673 0.500031 13.25 0.500031C13.7 0.500031 14.121 0.604364 14.513 0.81303C14.905 1.0217 15.234 1.30903 15.5 1.67503C15.7667 1.30836 16.096 1.02103 16.488 0.81303C16.88 0.60503 17.3007 0.500697 17.75 0.500031C18.5333 0.500031 19.1877 0.758364 19.713 1.27503C20.2383 1.7917 20.5007 2.42503 20.5 3.17503C20.5 3.5917 20.4167 3.98336 20.25 4.35003C20.0833 4.7167 19.8083 5.10836 19.425 5.52503C19.0417 5.9417 18.529 6.42503 17.887 6.97503C17.245 7.52503 16.4493 8.20003 15.5 9.00003Z"
                      fill={`${
                        tab === 1
                          ? "var(--accent-green)"
                          : "var(--gray-text-color)"
                      }`}
                    />
                  </svg>
                  Оповещения по темам
                </p>
              </div>
            </LowerPanel>
            <div className="profile-content">
              {tab === 0 && <Library />}
              {tab === 1 && (
                <Notifications
                  notifications={notifications}
                  setNotifications={setNotifications}
                />
              )}
            </div>
          </Body>          
          <Footer/>
        </>
      )}
    </div>
  );
}
