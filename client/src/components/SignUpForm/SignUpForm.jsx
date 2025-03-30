import "./SignUpForm.css";
import { INITIAL_STATE, formReducer } from "./SignUpForm.state";

import SignUpFormTab from "../SignUpFormTab/SignUpFormTab";
import Button from "../Button/Button";
import Input from "../Input/Input";
import Label from "../Label/Label";
import Hint from "../Hint/Hint";
import CustomDatePicker from "../CustomDatePicker/CustomDatePicker";
import FilterItem from "../FilterItem/FilterItem";

import { STATUS_SELECT } from "../../constants";

import { useEffect, useReducer, useRef, useState } from "react";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";

export default function SignUpForm({ selectedTab, setSelectedTab, signUp }) {
  const [formState, dispatchForm] = useReducer(formReducer, INITIAL_STATE);
  const {
    values,
    isValidTab0,
    isValidTab1,
    isValidTab2,
    isReadyToSubmitTab0,
    isReadyToSubmitTab1,
    isReadyToSubmitTab2,
    isReadyToSubmit
  } = formState;

  const [status, setStatus] = useState(STATUS_SELECT.student);
  const [inputType, setInputType] = useState("password");
  const [repeatInputType, setRepeatInputType] = useState("password");

  const lastNameRef = useRef();
  const firstNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const repeatPasswordRef = useRef();
  const countryRef = useRef();
  const birthdayRef = useRef();
  const employmentRef = useRef();

  const navBack = () => {
    setSelectedTab(selectedTab - 1);
  };

  const focusErrorTab0 = (isValid) => {
    switch (true) {
      case !isValid.lastName:
        lastNameRef.current.focus();
        break;
      case !isValid.firstName:
        firstNameRef.current.focus();
        break;
      case !isValid.email:
        emailRef.current.focus();
        break;
    }
  };

  const focusErrorTab1 = (isValid) => {
    switch (true) {
      case !isValid.password:
        passwordRef.current.focus();
        break;
      case !isValid.repeatPassword:
        repeatPasswordRef.current.focus();
        break;
    }
  };

  const focusErrorTab2 = (isValid) => {
    switch (true) {
      case !isValid.country:
        countryRef.current.focus();
        break;
      case !isValid.birthday:
        birthdayRef.current.focus();
        break;
      case !isValid.employment:
        employmentRef.current.focus();
        break;
    }
  };

  useEffect(() => {
    if (!isValidTab0.lastName || !isValidTab0.firstName || !isValidTab0.email) {
      focusErrorTab0(isValidTab0);
    } else if (isReadyToSubmitTab0) {
      setSelectedTab(1);
    }
  }, [isValidTab0, setSelectedTab, isReadyToSubmitTab0]);

  useEffect(() => {
    if (!isValidTab1.password || !isValidTab1.repeatPassword) {
      focusErrorTab1(isValidTab1);
    } else if (isReadyToSubmitTab1) {
      setSelectedTab(2);
    }
  }, [isValidTab1, setSelectedTab, isReadyToSubmitTab1]);

  useEffect(() => {
    if (
      !isValidTab2.country ||
      !isValidTab2.birthday ||
      !isValidTab2.employment
    ) {
      focusErrorTab2(isValidTab2);
    } else if (isReadyToSubmitTab2) {
      dispatchForm({ type: "SUBMIT" });
    }
  }, [isValidTab2, isReadyToSubmitTab2, status]);

  useEffect(() => {
    if (isReadyToSubmit) {
      const result = { ...values };
      Object.keys(result).forEach((key) => (values[key] = values[key].trim()));
      if (!result.status) {
        result.status = status.text;
      }
      result.themes = result.themes.split(",").map((elem) => elem.trim());
      signUp(result);
      dispatchForm({ type: "RESET_READINESS" });
    }
  }, [isReadyToSubmit, values, status, signUp]);

  const navForward = () => {
    switch (selectedTab) {
      case 0:
        dispatchForm({ type: "SUBMIT_TAB_0" });
        break;
      case 1:
        dispatchForm({ type: "SUBMIT_TAB_1" });
        break;
      case 2:
        dispatchForm({ type: "SUBMIT_TAB_2" });
        break;
    }
  };

  const showPassword = () => {
    setInputType(inputType === "password" ? "text" : "password");
  };

  const showRepeatPassword = () => {
    setRepeatInputType(repeatInputType === "password" ? "text" : "password");
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
      <div className="sign-up-form">
        {selectedTab === 0 && (
          <SignUpFormTab
            icon="personal.svg"
            title="Личные данные"
            titleDetails="Введите свое имя и электронную почту"
          >
            <Button type="button" className="sign-up-form-google-button">
              <img src="google.svg" alt="Google" />
              Продолжить с Google
            </Button>
            <div className="sign-up-form-divider">
              <div className="sign-up-form-divider-line" />
              или
              <div className="sign-up-form-divider-line" />
            </div>
            <div className="sign-up-form-container">
              <Label required={true} htmlFor="signUpLastName">
                Фамилия
              </Label>
              <Input
                type="text"
                value={values.lastName}
                onChange={onChange}
                placeholder="Введите фамилию"
                id="signUpLastName"
                maxLength="50"
                name="lastName"
                ref={lastNameRef}
                valid={isValidTab0.lastName}
                autoComplete="new-password"
                title={isValidTab0.lastName ? "" : "Поле не может быть пустым."}
              ></Input>
            </div>
            <div className="sign-up-form-double-container">
              <div className="sign-up-form-container sign-up-form-single-container">
                <Label required={true} htmlFor="signUpFirstName">
                  Имя
                </Label>
                <Input
                  type="text"
                  placeholder="Введите имя"
                  maxLength="50"
                  id="signUpFirstName"
                  name="firstName"
                  value={values.firstName}
                  onChange={onChange}
                  ref={firstNameRef}
                  valid={isValidTab0.firstName}
                  autoComplete="new-password"
                  title={
                    isValidTab0.firstName ? "" : "Поле не может быть пустым."
                  }
                ></Input>
              </div>
              <div className="sign-up-form-container sign-up-form-single-container">
                <Label htmlFor="signUpPatronymic">Отчество</Label>
                <Input
                  type="text"
                  placeholder="Введите отчество"
                  id="signUpPatronymic"
                  maxLength="50"
                  name="patronymic"
                  value={values.patronymic}
                  onChange={onChange}
                  autoComplete="new-password"
                ></Input>
              </div>
            </div>
            <div className="sign-up-form-container sign-up-form-email">
              <Label required={true} htmlFor="signUpEmail">
                Электронная почта для подтверждения
              </Label>
              <Input
                type="email"
                placeholder="Введите почту"
                maxLength="100"
                id="signUpEmail"
                name="email"
                value={values.email}
                onChange={onChange}
                ref={emailRef}
                valid={isValidTab0.email}
                title={
                  isValidTab0.email
                    ? ""
                    : "Почта должна быть в формате ivanov@gmail.com."
                }
                autoComplete="on"
              >
                <Hint text="Например, ivanov@bntu.by" />
                <img src="email_icon.svg" alt="Email" />
              </Input>
            </div>
          </SignUpFormTab>
        )}
        {selectedTab === 1 && (
          <SignUpFormTab
            icon="password.svg"
            title="Выберите пароль"
            titleDetails="Минимальная длина пароля 8 символов"
          >
            <div className="sign-up-form-container sign-up-form-password">
              <Label required={true} htmlFor="signUpPassword">
                Пароль
              </Label>
              <Input
                type={inputType}
                placeholder="Введите пароль"
                maxLength="65"
                id="signUpPassword"
                name="password"
                value={values.password}
                onChange={onChange}
                ref={passwordRef}
                valid={isValidTab1.password}
                autoComplete="new-password"
                title={
                  isValidTab1.password
                    ? ""
                    : "Пароль должен содержать не менее 8 и не более 65 символов. Допустимые символы: латинские буквы, цифры, знаки ' !@#$%^&* '."
                }
              >
                <img
                  src="password_icon.svg"
                  className="sign-up-form-password-icon"
                  alt="Пароль"
                />
                <Button
                  type="button"
                  title="Показать/скрыть пароль"
                  onClick={showPassword}
                >
                  {inputType === "text" && (
                    <EyeInvisibleFilled className="sign-up-form-password-icon" />
                  )}
                  {inputType === "password" && (
                    <EyeFilled className="sign-up-form-password-icon" />
                  )}
                </Button>
              </Input>
            </div>
            <div className="sign-up-form-container sign-up-form-password">
              <Label required={true} htmlFor="signUpRepeatPassword">
                Подтвердите пароль
              </Label>
              <Input
                type={repeatInputType}
                placeholder="Введите пароль"
                maxLength="65"
                id="signUpRepeatPassword"
                name="repeatPassword"
                value={values.repeatPassword}
                onChange={onChange}
                ref={repeatPasswordRef}
                autoComplete="new-password"
                valid={isValidTab1.repeatPassword}
                title={isValidTab1.repeatPassword ? "" : "Пароли не совпадают."}
              >
                <img
                  className="sign-up-form-password-icon"
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
          </SignUpFormTab>
        )}
        {selectedTab === 2 && (
          <SignUpFormTab
            icon="about_you.svg"
            title="О себе"
            titleDetails="Добавьте информацию о своем месте работы, области интересов, стране проживания"
          >
            <div className="sign-up-form-double-container">
              <div className="sign-up-form-container sign-up-form-single-container">
                <Label required={true} htmlFor="signUpCountry">
                  Страна
                </Label>
                <Input
                  type="text"
                  id="signUpCountry"
                  name="country"
                  maxLength="50"
                  placeholder="Введите страну"
                  value={values.country}
                  onChange={onChange}
                  ref={countryRef}
                  valid={isValidTab2.country}
                  autoComplete="new-password"
                  title={
                    isValidTab2.country ? "" : "Поле не может быть пустым."
                  }
                ></Input>
              </div>
              <div className="sign-up-form-container sign-up-form-single-container">
                <Label required={true} htmlFor="signUpBirthday">
                  Дата рождения
                </Label>
                <CustomDatePicker
                  id="signUpBirthday"
                  name="birthday"
                  value={
                    values.birthday
                      ? new Date(values.birthday).toISOString().slice(0, 10)
                      : ""
                  }
                  onChange={onChange}
                  ref={birthdayRef}
                  valid={isValidTab2.birthday}
                  autoComplete="new-password"
                  title={
                    isValidTab2.birthday ? "" : `Дата рождения не может быть пустой и лежать вне диапазона "01.01.1900" - сегодняшняя дата`
                  }
                />
              </div>
            </div>
            <div className="sign-up-form-container">
              <Label required={true} htmlFor="signUpEmployment">
                Место работы/учёбы
              </Label>
              <Input
                type="text"
                id="signUpEmployment"
                name="employment"
                maxLength="100"
                value={values.employment}
                onChange={onChange}
                placeholder="Введите место работы/учёбы"
                ref={employmentRef}
                valid={isValidTab2.employment}
                autoComplete="new-password"
                title={
                  isValidTab2.employment ? "" : "Поле не может быть пустым."
                }
              >
                <Hint text="Например, профессор физико-математических наук, БНТУ" />
              </Input>
            </div>
            <div className="sign-up-form-container">
              <Label htmlFor="signUpThemes">Интересующие вас темы</Label>
              <Input
                type="text"
                id="signUpThemes"
                name="themes"
                value={values.themes}
                maxLength="1000"
                onChange={onChange}
                autoComplete="new-password"
                placeholder="Введите темы через запятую"
              >
                <Hint text="Например, наночастицы диоксида титана, квантовая механика" />
              </Input>
            </div>
            <div className="sign-up-form-container">
              <Label htmlFor="signUpCustomStatus">Статус</Label>
              <div className="sign-up-form-status-container">
                {Object.keys(STATUS_SELECT).map((el) => {
                  return (
                    <FilterItem
                      key={el}
                      checked={status.text === STATUS_SELECT[el].text}
                      disabled={!!values.status}
                      name={STATUS_SELECT[el].text}
                      value={el}
                      text={STATUS_SELECT[el].text}
                      onChange={(e) => setStatus(STATUS_SELECT[e.target.value])}
                    />
                  );
                })}
              </div>
              <Input
                type="text"
                id="signUpStatus"
                name="status"
                maxLength="50"
                value={values.status}
                onChange={onChange}
                autoComplete="new-password"
                placeholder="Или введите свой вариант"
              />
            </div>
          </SignUpFormTab>
        )}
        <div className="sign-up-form-buttons">
          <Button
            type="button"
            className="sign-up-form-back-button"
            hidden={selectedTab === 0}
            onClick={navBack}
          >
            Назад
          </Button>
          <Button
            type="button"
            className="sign-up-form-forward-button"
            onClick={navForward}
          >
            Продолжить
          </Button>
        </div>
        <div
          className={`sign-up-form-agreement ${
            selectedTab !== 0 ? "sign-up-form-agreement-hidden" : ""
          }`}
        >
          Нажимая «Продолжить», вы соглашаетесь на обработку персональных
          данных.
        </div>
      </div>
      <div className="sign-up-form-progress">
        <span
          className={`sign-up-form-progress-step ${
            selectedTab === 0
              ? "sign-up-form-progress-step-active"
              : "sign-up-form-progress-step-finished"
          }`}
        ></span>
        <span
          className={`sign-up-form-progress-step ${
            selectedTab === 1
              ? "sign-up-form-progress-step-active"
              : selectedTab === 2
              ? "sign-up-form-progress-step-finished"
              : ""
          }`}
        ></span>
        <span
          className={`sign-up-form-progress-step ${
            selectedTab === 2 ? "sign-up-form-progress-step-active" : ""
          }`}
        ></span>
      </div>
    </>
  );
}
