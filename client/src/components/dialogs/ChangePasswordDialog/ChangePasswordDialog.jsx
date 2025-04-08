import "./ChangePasswordDialog.css";

import Button from "../../inputs/Button/Button";
import { useEffect, useRef, useState } from "react";
import BusyIndicator from "../../visuals/BusyIndicator/BusyIndicator";
import { isPasswordValid } from "../../../helpers/util";
import Label from "../../visuals/Label/Label";
import Input from "../../inputs/Input/Input";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";

export default function ChangePasswordDialog({
  dialogBusy,
  dialogState,
  setDialogState,
  setDialogOpen,
  changePassword
}) {
  const [isValid, setIsValid] = useState({
    oldPassword: true,
    newPassword: true,
    repeatPassword: true
  });
  const [inputType, setInputType] = useState("password");
  const [repeatInputType, setRepeatInputType] = useState("password");

  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();
  const repeatPasswordRef = useRef();

  const close = () => {
    setDialogOpen(false);
  };

  const cancel = () => {
    setDialogOpen(false);
  };

  const checkReadiness = () => {
    let res = { ...isValid };
    res.oldPassword = isPasswordValid(dialogState.oldPassword);
    res.newPassword = isPasswordValid(dialogState.newPassword);
    res.repeatPassword = dialogState.newPassword === dialogState.repeatPassword;

    setIsValid(res);

    Object.keys(res).forEach((key) => {
      if (!res[key]) {
        return false;
      }
    });
    return true;
  };

  const submitForm = (event) => {
    event.preventDefault();

    const isReadyToSubmit = checkReadiness();
    if (isReadyToSubmit) {
      changePassword(dialogState);
    }
  };

  useEffect(() => {
    switch (true) {
      case !isValid.oldPassword:
        oldPasswordRef.current.focus();
        break;
      case !isValid.newPassword:
        newPasswordRef.current.focus();
        break;
      case !isValid.repeatPassword:
        repeatPasswordRef.current.focus();
        break;
    }
  }, [isValid]);

  const showPassword = () => {
    setInputType(inputType === "password" ? "text" : "password");
  };

  const showRepeatPassword = () => {
    setRepeatInputType(repeatInputType === "password" ? "text" : "password");
  };

  return (
    <div className="darkened-background">
      {dialogBusy && (
        <div className="dialog-size dialog-change-password dialog-busy-background">
          <BusyIndicator />
        </div>
      )}
      <form
        className="dialog-size dialog-change-password dialog-wrap"
        onSubmit={submitForm}
      >
        <div className="dialog-close-button-container">
          <Button
            className="close-button"
            type="button"
            title="Закрыть"
            onClick={close}
          >
            <img src="cross.svg" alt="Закрыть" />
          </Button>
        </div>
        <p className="dialog-title">Изменить пароль</p>
        <div className="dialog-content dialog-change-password">
          <div className="change-password-container">
            <Label required={true} htmlFor="changeOldPassword">
              Старый пароль
            </Label>
            <Input
              type="password"
              placeholder="Введите старый пароль"
              maxLength="65"
              id="changeOldPassword"
              name="oldPassword"
              value={dialogState.oldPassword}
              onChange={(e) =>
                setDialogState({ ...dialogState, oldPassword: e.target.value })
              }
              ref={oldPasswordRef}
              valid={isValid.oldPassword}
              autoComplete="new-password"
              title={
                isValid.oldPassword
                  ? ""
                  : "Пароль должен содержать не менее 8 и не более 65 символов. Допустимые символы: латинские буквы, цифры, знаки ' !@#$%^&* '."
              }
            ></Input>
          </div>
          <div className="change-password-container">
            <Label required={true} htmlFor="changeNewPassword">
              Новый пароль
            </Label>
            <Input
              type={inputType}
              placeholder="Введите новый пароль"
              maxLength="65"
              id="changeNewPassword"
              name="newPassword"
              value={dialogState.newPassword}
              onChange={(e) =>
                setDialogState({ ...dialogState, newPassword: e.target.value })
              }
              ref={newPasswordRef}
              valid={isValid.newPassword}
              autoComplete="new-password"
              title={
                isValid.newPassword
                  ? ""
                  : "Пароль должен содержать не менее 8 и не более 65 символов. Допустимые символы: латинские буквы, цифры, знаки ' !@#$%^&* '."
              }
            >
              <Button
                type="button"
                title="Показать/скрыть пароль"
                onClick={showPassword}
              >
                {inputType === "text" && (
                  <EyeInvisibleFilled className="change-password-icon" />
                )}
                {inputType === "password" && (
                  <EyeFilled className="change-password-icon" />
                )}
              </Button>
            </Input>
          </div>
          <div className="change-password-container">
            <Label required={true} htmlFor="changeRepeatPassword">
            Подтвердите пароль
            </Label>
            <Input
              type={repeatInputType}
              placeholder="Введите новый пароль"
              maxLength="65"
              id="changeRepeatPassword"
              name="repeatPassword"
              value={dialogState.repeatPassword}
              onChange={(e) =>
                setDialogState({ ...dialogState, repeatPassword: e.target.value })
              }
              ref={repeatPasswordRef}
              valid={isValid.repeatPassword}
              autoComplete="new-password"
              title={isValid.repeatPassword ? "" : "Пароли не совпадают."}
            >
              <Button
                type="button"
                title="Показать/скрыть пароль"
                onClick={showRepeatPassword}
              >
                {repeatInputType === "text" && (
                  <EyeInvisibleFilled className="change-password-icon" />
                )}
                {repeatInputType === "password" && (
                  <EyeFilled className="change-password-icon" />
                )}
              </Button>
            </Input>
          </div>
        </div>
        <div className="dialog-buttons-container">
          <Button
            onClick={cancel}
            type="button"
            className="transparent-button"
          >
            Отменить
          </Button>
          <Button
            type="button"
            className="accent-button"
            onClick={submitForm}
          >
            Сохранить
          </Button>
        </div>
      </form>
    </div>
  );
}
