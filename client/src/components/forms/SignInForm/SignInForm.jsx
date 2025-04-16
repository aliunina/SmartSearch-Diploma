import "./SignInForm.css";
import { INITIAL_STATE, formReducer } from "./SignInForm.state";

import Button from "../../inputs/Button/Button";
import Input from "../../inputs/Input/Input";
import Label from "../../visuals/Label/Label";
import Logo from "../../visuals/Logo/Logo";

import { useEffect, useReducer, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";

export default function SignInForm({ signIn }) {
  const [formState, dispatchForm] = useReducer(formReducer, INITIAL_STATE);
  const { values, isValid, isReadyToSubmit } = formState;

  const [inputType, setInputType] = useState("password");

  const emailRef = useRef();
  const passwordRef = useRef();

  const focusError = (isValid) => {
    switch (true) {
      case !isValid.email:
        emailRef.current.focus();
        break;
      case !isValid.password:
        passwordRef.current.focus();
        break;
    }
  };

  useEffect(() => {
    if (!isValid.password || !isValid.email) {
      focusError(isValid);
    }
  }, [isValid]);

  useEffect(() => {
    if (isReadyToSubmit) {
      signIn(values);
      dispatchForm({ type: "RESET_READINESS" });
    }
  }, [isReadyToSubmit, values, signIn]);

  const navForward = () => {
    dispatchForm({ type: "SUBMIT" });
  };

  const showPassword = () => {
    setInputType(inputType === "password" ? "text" : "password");
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
    <>
      <div className="sign-in-form">
        <p className="sign-in-form-title">
          Вход в <Logo className="sign-in-form-logo" />
        </p>
        <div className="sign-in-form-container sign-in-form-email">
          <Label htmlFor="signInEmail">
            Электронная почта для подтверждения
          </Label>
          <Input
            type="email"
            placeholder="Введите почту"
            value={values.email}
            onChange={onChange}
            id="signInEmail"
            maxLength="100"
            name="email"
            ref={emailRef}
            valid={isValid.email}
            title={
              isValid.email
                ? ""
                : "Почта должна быть в формате ivanov@gmail.com."
            }
            autoComplete="on"
          >
            <img src="email_icon.svg" alt="Email" />
          </Input>
        </div>
        <div className="sign-in-form-container sign-in-form-password">
          <Label>Пароль</Label>
          <Input
            type={inputType}
            placeholder="Введите пароль"
            maxLength="65"
            id="signInPassword"
            name="password"
            value={values.password}
            onChange={onChange}
            ref={passwordRef}
            valid={isValid.password}
            autoComplete="off"
            title={
              isValid.password
                ? ""
                : "Пароль должен содержать не менее 8 и не более 50 символов. Допустимые символы: латинские буквы, цифры, знаки ' !@#$%^&* '."
            }
          >
            <img
              src="password_icon.svg"
              className="sign-in-form-password-icon"
              alt="Пароль"
            />
            <Button type="button" title="Показать/скрыть пароль" onClick={showPassword}>
              {inputType === "text" && (
                <EyeInvisibleFilled className="sign-in-form-password-icon" />
              )}
              {inputType === "password" && (
                <EyeFilled className="sign-in-form-password-icon" />
              )}
            </Button>
          </Input>
        </div>
        <Button
          type="button"
          className="accent-button"
          onClick={navForward}
        >
          Продолжить
        </Button>
        <Link to="/account-recovery" className="sign-in-form-forgot-password">
          Забыли пароль?
        </Link>
      </div>
    </>
  );
}
