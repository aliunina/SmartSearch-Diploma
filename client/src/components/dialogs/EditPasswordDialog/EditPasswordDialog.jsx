import "./EditPasswordDialog.css";

import Button from "../../inputs/Button/Button";
import { useEffect, useRef, useState } from "react";
import BusyIndicator from "../../visuals/BusyIndicator/BusyIndicator";
import { isPasswordValid } from "../../../helpers/util";
import Label from "../../visuals/Label/Label";
import Input from "../../inputs/Input/Input";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";

export default function EditPasswordDialog({
  dialogBusy,
  dialogState,
  setDialogState,
  setDialogOpen,
  editPassword
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

    for (const key of Object.keys(res)) {
      if (!res[key]) {
        return false;
      }
    }
    return true;
  };

  const submitForm = (event) => {
    event.preventDefault();

    const isReadyToSubmit = checkReadiness();
    if (isReadyToSubmit) {
      editPassword(dialogState);
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
      <form
        className="dialog-size dialog-edit-password dialog-wrap"
        onSubmit={submitForm}
      >
        {dialogBusy && (
          <div className="dialog-size dialog-busy-background">
            <BusyIndicator />
          </div>
        )}
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
        <div className="dialog-content dialog-edit-password">
          <div className="edit-password-container">
            <Label required={true} htmlFor="editOldPassword">
              Старый пароль
            </Label>
            <Input
              type="password"
              placeholder="Введите старый пароль"
              maxLength="65"
              id="editOldPassword"
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
          <div className="edit-password-container">
            <Label required={true} htmlFor="editNewPassword">
              Новый пароль
            </Label>
            <Input
              type={inputType}
              placeholder="Введите новый пароль"
              maxLength="65"
              id="editNewPassword"
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
                  <EyeInvisibleFilled className="edit-password-icon" />
                )}
                {inputType === "password" && (
                  <EyeFilled className="edit-password-icon" />
                )}
              </Button>
            </Input>
          </div>
          <div className="edit-password-container">
            <Label required={true} htmlFor="editRepeatPassword">
              Подтвердите пароль
            </Label>
            <Input
              type={repeatInputType}
              placeholder="Введите новый пароль"
              maxLength="65"
              id="editRepeatPassword"
              name="repeatPassword"
              value={dialogState.repeatPassword}
              onChange={(e) =>
                setDialogState({
                  ...dialogState,
                  repeatPassword: e.target.value
                })
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
                  <EyeInvisibleFilled className="edit-password-icon" />
                )}
                {repeatInputType === "password" && (
                  <EyeFilled className="edit-password-icon" />
                )}
              </Button>
            </Input>
          </div>
        </div>
        <div className="dialog-buttons-container">
          <Button onClick={cancel} type="button" className="transparent-button">
            Отменить
          </Button>
          <Button type="button" className="accent-button" onClick={submitForm}>
            Сохранить
          </Button>
        </div>
      </form>
    </div>
  );
}
