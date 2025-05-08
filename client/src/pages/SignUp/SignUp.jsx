import "./SignUp.css";
import Header from "../../layouts/CommonLayout/Header/Header";
import Logo from "../../components/visuals/Logo/Logo";
import Body from "../../layouts/CommonLayout/Body/Body";
import LeftPanel from "../../layouts/SignUpLayout/LeftPanel/LeftPanel";
import RightPanel from "../../layouts/SignUpLayout/RightPanel/RightPanel";
import SignUpStep from "../../components/visuals/SignUpStep/SignUpStep";
import SignUpForm from "../../components/forms/SignUpForm/SignUpForm";
import BusyIndicator from "../../components/visuals/BusyIndicator/BusyIndicator";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  showErrorMessageToast,
  showSuccessMessageToast
} from "../../helpers/util";
import Footer from "../../layouts/CommonLayout/Footer/Footer";

export default function SignUp() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [busy, setBusy] = useState(false);

  const signUp = (values) => {
    setBusy(true);
    const serverUrl = import.meta.env.VITE_SERVER_API_URL;
    axios
      .post(serverUrl + "/user/register", values)
      .then((response) => {
        if (response.status === 200) {
          showSuccessMessageToast(
            "Письмо с подтверждением отправлено на указанную при регистрации почту."
          );
          navigate("/");
        } else {
          showErrorMessageToast("Произошла ошибка, попробуйте еще раз.");
        }
        setBusy(false);
      })
      .catch((response) => {
        if (response.status === 400) {
          showErrorMessageToast("Пользователь с таким email уже существует.");
        } else {
          showErrorMessageToast("Произошла ошибка, попробуйте еще раз.");
        }
        setBusy(false);
      });
  };

  return (
    <>
      {busy && (
        <div className="darkened-background">
          <BusyIndicator />
        </div>
      )}
      <Header>
        <Link to="/">
          <Logo className="header-logo" />
        </Link>
      </Header>
      <Body>
        <LeftPanel>
          <div className="sign-up-steps">
            <SignUpStep
              title="Личные данные"
              active={selectedTab === 0}
              description="Введите свое имя и электронную почту."
            />
            <SignUpStep
              title="Выберите пароль"
              active={selectedTab === 1}
              description="Минимальная длина пароля 8 символов."
            />
            <SignUpStep
              title="О себе"
              active={selectedTab === 2}
              description="Добавьте информацию о своем месте работы, области интересов, стране проживания."
            />
          </div>
        </LeftPanel>
        <RightPanel>
          <SignUpForm
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            signUp={signUp}
          />
        </RightPanel>
      </Body>
      <Footer className="fixed-footer"/>
    </>
  );
}
