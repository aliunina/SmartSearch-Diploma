import "./RecoveryForm.css";
import { INITIAL_STATE, formReducer } from "./RecoveryForm.state";

import Label from "../../components/Label/Label";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

import { useEffect, useReducer, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";

export default function RecoveryForm({
  step,
  setStep,
  checkEmail,
  checkCode,
  resetPassword,
  validAcc, 
  setValidAcc
}) {
  const [formState, dispatchForm] = useReducer(formReducer, INITIAL_STATE);
  const {
    values,
    isValidStep0,
    isValidStep1,
    isValidStep2,
    isReadyToSubmitStep0,
    isReadyToSubmitStep1,
    isReadyToSubmitStep2
  } = formState;

  const navigate = useNavigate();
  const [inputType, setInputType] = useState("password");
  const [repeatInputType, setRepeatInputType] = useState("password");

  const emailRef = useRef();
  const codeRef = useRef();
  const passwordRef = useRef();
  const repeatPasswordRef = useRef();

  const showPassword = () => {
    setInputType(inputType === "password" ? "text" : "password");
  };

  const showRepeatPassword = () => {
    setRepeatInputType(repeatInputType === "password" ? "text" : "password");
  };

  useEffect(() => {
    if (!isValidStep0) {
      emailRef.current.focus();
    } else if (isReadyToSubmitStep0) {
      checkEmail(emailRef.current.value);
      dispatchForm({ type: "RESET_READINESS_STEP_0" });
    }
  }, [isValidStep0, setStep, isReadyToSubmitStep0, checkEmail]);

  useEffect(() => {
    if (!isValidStep1) {
      codeRef.current.focus();
    } else if (isReadyToSubmitStep1) {
      checkCode(codeRef.current.value);
      dispatchForm({ type: "RESET_READINESS_STEP_1" });
    }
  }, [isValidStep1, setStep, isReadyToSubmitStep1, checkCode]);

  const focusErrorStep2 = (isValid) => {
    switch (true) {
      case !isValid.password:
        passwordRef.current.focus();
        break;
      case !isValid.repeatPassword:
        repeatPasswordRef.current.focus();
        break;
    }
  };

  useEffect(() => {
    if (!isValidStep2.password || !isValidStep2.repeatPassword) {
      focusErrorStep2(isValidStep2);
    } else if (isReadyToSubmitStep2) {
      resetPassword(passwordRef.current.value);
      dispatchForm({ type: "RESET_READINESS_STEP_2" });
    }
  }, [isValidStep2, setStep, isReadyToSubmitStep2, resetPassword]);

  const navForward = () => {
    switch (step) {
      case 0:
        dispatchForm({ type: "SUBMIT_STEP_0" });
        break;
      case 1:
        dispatchForm({ type: "SUBMIT_STEP_1" });
        break;
      case 2:
        dispatchForm({ type: "SUBMIT_STEP_2" });
        break;
    }
  };

  const recoveryAcc = () => {
    setStep(0);
    setValidAcc(true);
    dispatchForm({ type: "RESET_FORM" });
  };

  const signIn = () => {
    navigate("/sign-in");
  };

  const onChange = (event) => {
    dispatchForm({
      type: "SET_VALUE",
      payload: {
        [event.target.name]: event.target.value
      }
    });
  };

  return (
    <div className="recovery-form">
      {step === 0 && validAcc && (
        <div className="recovery-form-step-container">
          <p className="recovery-form-title">Восстановление аккаунта</p>
          <p className="recovery-form-subtitle">
            Восстановите свой аккаунт в БНТУ Умный поиск
          </p>
          <div className="recovery-form-container recovery-form-email">
            <Label htmlFor="recoveryEmail">Электронная почта</Label>
            <Input
              type="email"
              placeholder="Введите почту"
              value={values.email}
              onChange={onChange}
              id="recoveryEmail"
              maxLength="100"
              name="email"
              ref={emailRef}
              valid={isValidStep0}
              title={
                isValidStep0
                  ? ""
                  : "Почта должна быть в формате ivanov@gmail.com."
              }
              autoComplete="on"
            >
              <img src="email_icon.svg" alt="Email" />
            </Input>
          </div>
        </div>
      )}
      {step === 1 && validAcc && (
        <div className="recovery-form-step-container">
          <p className="recovery-form-title">Восстановление аккаунта</p>
          <p className="recovery-form-subtitle">
            Это нужно для подтверждения того, что аккаунт принадлежит вам.
          </p>
          <p className="recovery-form-details">
            Письмо с кодом подтверждения отправлено на адрес {values.email}
          </p>
          <div className="recovery-form-container">
            <Label htmlFor="recoveryCode">Код</Label>
            <Input
              type="text"
              placeholder="Введите код"
              id="recoveryCode"
              name="code"
              maxLength="6"
              value={values.code}
              onChange={onChange}
              ref={codeRef}
              valid={isValidStep1}
              title={isValidStep1 ? "" : "Код должен состоять из 6 цифр."}
              autoComplete="off"
            />
          </div>
        </div>
      )}
      {step === 2 && validAcc && (
        <div className="recovery-form-step-container">
          <p className="recovery-form-title">Выберите новый пароль</p>
          <p className="recovery-form-subtitle">
            Минимальная длина пароля 8 символов
          </p>
          <div className="recovery-form-container recovery-form-password">
            <Label required={true} htmlFor="recoveryPassword">
              Пароль
            </Label>
            <Input
              type={inputType}
              placeholder="Введите пароль"
              maxLength="65"
              id="recoveryPassword"
              name="password"
              value={values.password}
              onChange={onChange}
              ref={passwordRef}
              valid={isValidStep2.password}
              autoComplete="new-password"
              title={
                isValidStep2.password
                  ? ""
                  : "Пароль должен содержать не менее 8 и не более 50 символов. Допустимые символы: латинские буквы, цифры, знаки ' !@#$%^&* '."
              }
            >
              <img
                src="password_icon.svg"
                className="recovery-form-password-icon"
                alt="Пароль"
              />
              <Button
                type="button"
                title="Показать/скрыть пароль"
                onClick={showPassword}
              >
                {inputType === "text" && (
                  <EyeInvisibleFilled className="recovery-form-password-icon" />
                )}
                {inputType === "password" && (
                  <EyeFilled className="recovery-form-password-icon" />
                )}
              </Button>
            </Input>
          </div>
          <div className="recovery-form-container recovery-form-password">
            <Label required={true}>Подтвердите пароль</Label>
            <Input
              type={repeatInputType}
              placeholder="Введите пароль"
              maxLength="65"
              id="recoveryRepeatPassword"
              name="repeatPassword"
              value={values.repeatPassword}
              onChange={onChange}
              ref={repeatPasswordRef}
              autoComplete="new-password"
              valid={isValidStep2.repeatPassword}
              title={isValidStep2.repeatPassword ? "" : "Пароли не совпадают."}
            >
              <img
                className="recovery-form-password-icon"
                src="password_icon.svg"
                alt="Пароль"
              />
              <Button
                type="button"
                title="Показать/скрыть пароль"
                onClick={showRepeatPassword}
              >
                {repeatInputType === "text" && (
                  <EyeInvisibleFilled className="recovery-form-password-icon" />
                )}
                {repeatInputType === "password" && (
                  <EyeFilled className="recovery-form-password-icon" />
                )}
              </Button>
            </Input>
          </div>
        </div>
      )}
      {step === 3 && validAcc && (
        <div className="recovery-form-step-container">
          <p className="recovery-form-title">Ваш аккаунт восстановлен</p>

          <p className="recovery-form-details">
            С возвращением в аккаунт! Теперь вы можете войти в БНТУ Умный поиск.
          </p>
        </div>
      )}
      {!validAcc && (
        <div className="recovery-form-step-container">
          <p className="recovery-form-title">Не удалось войти в аккаунт</p>
          <p className="recovery-form-subtitle">
            Нам не удалось подтвердить, что аккаунт принадлежит вам.
          </p>
          <p className="recovery-form-subtitle">
            Попробуйте восстановить аккаунт еще раз.
          </p>
        </div>
      )}
      <Button
        hidden={step === 3 || !validAcc}
        className="recovery-form-forward-button"
        onClick={navForward}
      >
        Продолжить
      </Button>
      <Button
        hidden={step !== 3 || !validAcc}
        className="recovery-form-forward-button"
        onClick={signIn}
      >
        Войти
      </Button>
      <Button
        hidden={validAcc}
        className="recovery-form-forward-button"
        onClick={recoveryAcc}
      >
        Восстановить аккаунт
      </Button>
      <Link
        to="/sign-in"
        hidden={step >= 2 || !validAcc}
        className="recovery-form-back-to-signin"
      >
        Вернуться ко входу
      </Link>
    </div>
  );
}
