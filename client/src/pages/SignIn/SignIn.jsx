import "./SignIn.css";

import Body from "../../layouts/CommonLayout/Body/Body";
import Header from "../../layouts/CommonLayout/Header/Header";

import Logo from "../../components/visuals/Logo/Logo";
import SignInForm from "../../components/forms/SignInForm/SignInForm";
import BusyIndicator from "../../components/visuals/BusyIndicator/BusyIndicator";

import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext/UserContext";
import { useContext, useState } from "react";

import {
  showErrorMessageToast,
  showSuccessMessageToast
} from "../../helpers/util";

export default function SignIn() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [busy, setBusy] = useState(false);

  const signIn = (credentials) => {
    setBusy(true);
    const serverUrl = import.meta.env.VITE_SERVER_API_URL;
    axios
      .post(serverUrl + "/user/authorize", credentials, {
        withCredentials: true
      })
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data);
          if (location.state?.navBack) {
            navigate(-1);
          } else {
            navigate("/");
          }
          showSuccessMessageToast("Вход успешно выполнен.");
        } else {
          showErrorMessageToast("Произошла ошибка, попробуйте еще раз.");
        }
        setBusy(false);
      })
      .catch((response) => {
        console.log(response.data);
        if (response.status === 401) {
          showErrorMessageToast("Неверный email или пароль.");
        } else if (response.status === 403) {
          showErrorMessageToast(
            "Email не подтвержден. Проверьте ваш почтовый ящик."
          );
        } else {
          showErrorMessageToast("Произошла ошибка, попробуйте позже.");
        }
        setBusy(false);
      });
  };

  return (
    <>
      {busy && (
        <div className="darkened-background">
          <BusyIndicator/>
        </div>
      )}
      <Header>
        <Link to="/">
          <Logo className="header-logo" />
        </Link>
      </Header>
      <Body>
        <SignInForm signIn={signIn}></SignInForm>
      </Body>
    </>
  );
}
