import "./SignIn.css";

import Body from "../../layouts/CommonLayout/Body/Body";
import Header from "../../layouts/CommonLayout/Header/Header";
import Logo from "../../components/Logo/Logo";
import SignInForm from "../../components/SignInForm/SignInForm";

import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext/UserContext";
import { useContext } from "react";
import {
  showErrorMessageToast,
  showSuccessMessageToast
} from "../../helpers/util";
import { SERVER_PARAMS } from "../../constants";

export default function SignIn() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const signIn = (credentials) => {
    axios
      .post(SERVER_PARAMS.url + "/authorize/user", credentials)
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data);
          navigate("/");
          showSuccessMessageToast("Вход успешно выполнен.");
        } else {
          showErrorMessageToast("Произошла ошибка, попробуйте еще раз.");
        }
      })
      .catch((response) => {
        console.log(response.data);
        if (response.status === 404) {
          showErrorMessageToast("Пользователь с таким email не найден.");
        } else if (response.status === 401) {
          showErrorMessageToast("Неверный пароль.");
        } else if (response.status === 403) {
          showErrorMessageToast(
            "Email не подтвержден. Проверьте ваш почтовый ящик."
          );
        } else {
          showErrorMessageToast("Произошла ошибка, попробуйте позже.");
        }
      });
  };

  return (
    <>
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
