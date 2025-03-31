import { Link } from "react-router-dom";
import Body from "../../layouts/CommonLayout/Body/Body";
import Header from "../../layouts/CommonLayout/Header/Header";
import "./Recovery.css";
import Logo from "../../components/Logo/Logo";
import RecoveryForm from "../../components/RecoveryForm/RecoveryForm";
import { useState } from "react";
import { SERVER_PARAMS } from "../../constants";
import axios from "axios";
import { showErrorMessageToast } from "../../helpers/util";

export default function Recovery() {
  const [userEmail, setUserEmail] = useState(null);
  const [resetCode, setResetCode] = useState(null);
  const [step, setStep] = useState(0);
  const [validAcc, setValidAcc] = useState(true);

  const checkEmail = (email) => {
    axios
      .get(SERVER_PARAMS.url + "/user/recovery/" + email)
      .then((response) => {
        if (response.status === 200) {
          setUserEmail(email);
          setStep(1);
        } else if (response.status === 204) {
          showErrorMessageToast("Пользователь с таким email не существует.");
        } else {
          showErrorMessageToast("Произошла ошибка, попробуйте еще раз.");
        }
      })
      .catch((response) => {
        console.log(response);
        if (response.status === 403) {
          showErrorMessageToast(
            "Email не подтвержден. Проверьте ваш почтовый ящик."
          );
        } else {
          showErrorMessageToast("Произошла ошибка, попробуйте еще раз.");
        }
      });
  };

  const checkCode = (code) => {
    axios
      .post(SERVER_PARAMS.url + "/user/check-code", { email: userEmail, code })
      .then((response) => {
        if (response.status === 200) {
          setResetCode(code);
          setStep(2);
        } else if (response.status === 204) {
          showErrorMessageToast(
            "Пользователь с указанным email или запись для сброса пароля не найдены."
          );
        } else {
          showErrorMessageToast("Произошла ошибка, попробуйте еще раз.");
        }
      })
      .catch((response) => {
        console.log(response);
        if (response.status === 410) {
          showErrorMessageToast(
            "Срок действия кода закончился. Запросите сброс пароля еще раз."
          );
        } else if (response.status === 401) {
          showErrorMessageToast("Неверный код.");
        } else {
          showErrorMessageToast("Произошла ошибка, попробуйте еще раз.");
        }
      });
  };

  const resetPassword = (password) => {
    axios
      .put(SERVER_PARAMS.url + "/user/reset-password", {
        password,
        email: userEmail,
        code: resetCode
      })
      .then((response) => {
        if (response.status === 200) {
          setStep(3);
        } else if (response.status === 204) {
          showErrorMessageToast(
            "Пользователь с указанным email или запись для сброса пароля не найдены."
          );
        } else {
          showErrorMessageToast("Произошла ошибка, попробуйте еще раз.");
        }
      })
      .catch((response) => {
        console.log(response);
        if (response.status === 410) {
          showErrorMessageToast(
            "Срок действия кода закончился. Запросите сброс пароля еще раз."
          );
        } else if (response.status === 400) {
          showErrorMessageToast("Новый пароль не может быть равен старому.");
        } else if (response.status === 401) {
          setValidAcc(false);
        } else {
          showErrorMessageToast("Произошла ошибка, попробуйте еще раз.");
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
        <RecoveryForm
          step={step}
          setStep={setStep}
          validAcc={validAcc}
          setValidAcc={setValidAcc}
          checkEmail={checkEmail}
          checkCode={checkCode}
          resetPassword={resetPassword}
        />
      </Body>
    </>
  );
}
