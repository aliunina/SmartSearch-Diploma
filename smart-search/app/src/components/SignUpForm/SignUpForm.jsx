import { useState } from "react";
import SignUpFormTab from "../SignUpFormTab/SignUpFormTab";
import Button from "../Button/Button";
import "./SignUpForm.css";
import Input from "../Input/Input";
import Label from "../Label/Label";
import Hint from "../Hint/Hint";

export default function SignUpForm() {
  const [selectedTab, setSelectedTab] = useState("personal");
  return (
    <div className="sign-up-form">
      {selectedTab === "personal" && (
        <SignUpFormTab
          icon="personal.svg"
          title="Личные данные"
          titleDetails="Введите свое имя и электронную почту"
        >
          <Button className="sign-up-form-google-button">
            <img src="google.svg" alt="Google" />
            Продолжить с Google
          </Button>
          <div className="sign-up-form-divider">
            <div className="sign-up-form-divider-line" />
            или
            <div className="sign-up-form-divider-line" />
          </div>
          <div className="sign-up-form-container sign-up-form-surname-container">
            <Label required={true}>Фамилия</Label>
            <Input type="text" placeholder="Введите фамилию"></Input>
          </div>
          <div className="sign-up-form-name-patronymic-container">
            <div className="sign-up-form-container sign-up-form-name-container">
              <Label required={true}>Имя</Label>
              <Input type="text" placeholder="Введите имя"></Input>
            </div>
            <div className="sign-up-form-container sign-up-form-patronymic-container">
              <Label>Отчество</Label>
              <Input type="text" placeholder="Введите отчество"></Input>
            </div>
          </div>
          <div className="sign-up-form-container">
              <Label required={true}>Электронная почта для подтверждения</Label>
              <Input type="text" placeholder="Введите почту">
              <Hint text="Например, ivanov@bntu.by"/></Input>
            </div>
        </SignUpFormTab>
      )}
      {selectedTab === "password" && (
        <SignUpFormTab
          icon="password.svg"
          title="Выберите пароль"
          titleDetails="Минимальная длина пароля 8 символов"
        ></SignUpFormTab>
      )}
      {selectedTab === "aboutYou" && (
        <SignUpFormTab
          icon="about_you.svg"
          title="О себе"
          titleDetails="Добавьте информацию о своем месте работы, области интересов, стране проживания"
        ></SignUpFormTab>
      )}
    </div>
  );
}