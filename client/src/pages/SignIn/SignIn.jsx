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
import { DB_PARAMS } from "../../constants";

export default function SignIn() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const signIn = (credentials) => {
    const fetchData = async () => {
      axios
        .post(DB_PARAMS.url + "/authorize/user", credentials)
        .then((response) => {
          setUser(response.data);
          navigate("/");
          showSuccessMessageToast("Вход успешно выполнен.");
        })
        .catch((response) => {
          console.log(response.data);
          if (response.status === 404) {
            showErrorMessageToast("Пользователь с таким email не найден.");
          } else if (response.status === 401) {
            showErrorMessageToast("Неверный пароль.");
          } else {
            showErrorMessageToast("Произошла ошибка, попробуйте позже.");
          }
        });
    };
    fetchData();
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
