import "./Profile.css";
import { UserContext } from "../../contexts/UserContext/UserContext";

import Body from "../../layouts/SearchLayout/Body/Body";
import Header from "../../layouts/CommonLayout/Header/Header";
import UpperPanel from "../../layouts/ProfileLayout/UpperPanel/UpperPanel";
import LowerPanel from "../../layouts/ProfileLayout/LowerPanel/LowerPanel";

import Avatar from "../../components/Avatar/Avatar";
import Logo from "../../components/Logo/Logo";

import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import EditProfileDialog from "../../components/EditProfileDialog/EditProfileDialog";
import axios from "axios";
import {
  showErrorMessageToast,
  showSuccessMessageToast
} from "../../helpers/util";

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
    }
  }, [user, navigate]);

  const [tab, setTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState(user);
  const [dialogBusy, setDialogBusy] = useState(false);

  useEffect(() => {
    setTab(location.state?.tab ? location.state.tab : 0);
  }, [location]);

  const editUserProfile = () => {
    const state = { ...user };
    if (user?.themes) {
      state.themes = user.themes.join(", ");
    }
    setDialogState(state);
    setDialogOpen(true);
  };

  const updateUser = (values) => {
    if (values.themes) {
      values.themes = values.themes.split(",").map((elem) => elem.trim());
    }

    setDialogBusy(true);    
    const serverUrl = import.meta.env.VITE_SERVER_API_URL;
    axios
      .put(serverUrl + "/user/update", values, {
        withCredentials: true
      })
      .then((response) => {
        if (response.status === 200 && response.data) {
          setUser(response.data);
          showSuccessMessageToast("Данные успешно обновлены.");
          setDialogOpen(false);
        } else {
          showErrorMessageToast("Произошла ошибка, попробуйте еще раз.");
        }
        setDialogBusy(false);
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
        setDialogBusy(false);
      });
  };

  return (
    <>
      {user && (
        <>
          <Header>
            <Link to="/">
              <Logo className="header-logo" />
            </Link>
            {dialogOpen && (
              <EditProfileDialog
                dialogState={dialogState}
                setDialogOpen={setDialogOpen}
                setDialogState={setDialogState}
                updateUser={updateUser}
                dialogBusy={dialogBusy}
              />
            )}
          </Header>
          <Body>
            <UpperPanel>
              <Avatar
                size={"11em"}
                title="Профиль"
              />
              <div className="profile-user-details">
                <div className="profile-user-name-edit-button">
                  <p className="profile-user-name">
                    {user.lastName} {user.firstName} {user.patronymic}
                  </p>
                  <Button
                    className="profile-edit-button"
                    onClick={editUserProfile}
                  >
                    <img src="edit-profile.svg" alt="Изменить" />
                    Изменить профиль
                  </Button>
                </div>
                <p className="profile-user-employment">{user.employment}</p>
                <div>
                  <p className="profile-user-themes-title">Области интересов</p>
                  <div className="profile-user-themes">
                    {user.themes.map((theme) => {
                      return (
                        <div className="profile-user-theme" key={theme}>
                          {theme}
                        </div>
                      );
                    })}
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
                      fill={`${tab === 0 ? "#008054" : "#5C5C5C"}`}
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
                      fill={`${tab === 1 ? "#008054" : "#5C5C5C"}`}
                    />
                  </svg>
                  Оповещения по теме
                </p>
                <p
                  className={`${
                    tab === 2 ? "profile-tab profile-tab-active" : "profile-tab"
                  }`}
                  onClick={() => setTab(2)}
                >
                  <svg
                    width="19"
                    height="18"
                    viewBox="0 0 19 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.5 14H11.5V12H4.5V14ZM4.5 10H14.5V8.00003H4.5V10ZM4.5 6.00003H14.5V4.00003H4.5V6.00003ZM2.5 18C1.95 18 1.479 17.804 1.087 17.412C0.695002 17.02 0.499335 16.5494 0.500002 16V2.00003C0.500002 1.45003 0.696002 0.979032 1.088 0.587032C1.48 0.195032 1.95067 -0.000634451 2.5 3.22154e-05H16.5C17.05 3.22154e-05 17.521 0.196032 17.913 0.588032C18.305 0.980032 18.5007 1.4507 18.5 2.00003V16C18.5 16.55 18.304 17.021 17.912 17.413C17.52 17.805 17.0493 18.0007 16.5 18H2.5Z"
                      fill={`${tab === 2 ? "#008054" : "#5C5C5C"}`}
                    />
                  </svg>
                  Оповещения по журналам
                </p>
              </div>
            </LowerPanel>
          </Body>
        </>
      )}
    </>
  );
}
