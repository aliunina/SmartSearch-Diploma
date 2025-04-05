import "./EditProfileDialog.css";

import Button from "../Button/Button";
import Input from "../Input/Input";
import Hint from "../Hint/Hint";
import Label from "../Label/Label";
import CustomDatePicker from "../CustomDatePicker/CustomDatePicker";
import { useEffect, useRef, useState } from "react";
import BusyIndicator from "../BusyIndicator/BusyIndicator";

export default function EditProfileDialog({
  dialogBusy,
  dialogState,
  setDialogState,
  setDialogOpen,
  updateUser
}) {
  const [isValid, setIsValid] = useState({
    lastName: true,
    firstName: true,
    country: true,
    birthday: true,
    employment: true,
    status: true
  });

  const lastNameRef = useRef();
  const firstNameRef = useRef();
  const statusRef = useRef();
  const countryRef = useRef();
  const birthdayRef = useRef();
  const employmentRef = useRef();

  const close = () => {
    setDialogOpen(false);
  };

  const cancel = () => {
    setDialogOpen(false);
  };

  const checkReadiness = () => {
    let res = { ...isValid };
    res.lastName = dialogState.lastName?.trim().length > 0;
    res.firstName = dialogState.firstName?.trim().length > 0;
    res.country = dialogState.country?.trim().length > 0;
    res.employment = dialogState.employment?.trim().length > 0;
    res.status = dialogState.status?.trim().length > 0;

    const birthday = dialogState.birthday.trim();
    res.birthday = !(
      birthday.length > 0 &&
      (new Date(birthday) > Date.now() ||
        new Date(birthday) < new Date("1900-01-01"))
    );

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
      updateUser(dialogState);
    }
  };

  useEffect(() => {
    switch (true) {
      case !isValid.lastName:
        lastNameRef.current.focus();
        break;
      case !isValid.firstName:
        firstNameRef.current.focus();
        break;
      case !isValid.country:
        countryRef.current.focus();
        break;
      case !isValid.birthday:
        birthdayRef.current.focus();
        break;
      case !isValid.employment:
        employmentRef.current.focus();
        break;
      case !isValid.status:
        statusRef.current.focus();
        break;
    }
  }, [isValid]);

  return (
    <div className="darkened-background">
      {dialogBusy && (
        <div className="dialog-size dialog-busy-background">
          <BusyIndicator/>
        </div>
      )}
      <form className="dialog-size dialog-wrap" onSubmit={submitForm}>
        <div className="dialog-close-button-container">
          <Button
            className="dialog-close-button"
            type="button"
            title="Закрыть"
            onClick={close}
          >
            <img src="cross.svg" alt="Закрыть" />
          </Button>
        </div>
        <p className="dialog-title">Изменить профиль</p>
        <div className="dialog-content">
          <div className="edit-profile-container">
            <Label required={true} htmlFor="editProfileLastName">
              Фамилия
            </Label>
            <Input
              id="editProfileLastName"
              value={dialogState.lastName}
              onChange={(e) =>
                setDialogState({ ...dialogState, lastName: e.target.value })
              }
              ref={lastNameRef}
              type="text"
              maxLength="50"
              placeholder="Введите фамилию"
              valid={isValid.lastName}
              autoComplete="new-password"
              title={isValid.lastName ? "" : "Поле не может быть пустым."}
            />
          </div>
          <div className="edit-profile-container">
            <Label required={true} htmlFor="editProfileFirstName">
              Имя
            </Label>
            <Input
              id="editProfileFirstName"
              value={dialogState.firstName}
              onChange={(e) =>
                setDialogState({ ...dialogState, firstName: e.target.value })
              }
              type="text"
              ref={firstNameRef}
              maxLength="50"
              placeholder="Введите имя"
              valid={isValid.firstName}
              autoComplete="new-password"
              title={isValid.firstName ? "" : "Поле не может быть пустым."}
            />
          </div>
          <div className="edit-profile-container">
            <Label htmlFor="editProfilePatronymic">Отчество</Label>
            <Input
              id="editProfilePatronymic"
              value={dialogState.patronymic}
              onChange={(e) =>
                setDialogState({ ...dialogState, patronymic: e.target.value })
              }
              type="text"
              maxLength="50"
              placeholder="Введите отчество"
              autoComplete="new-password"
            />
          </div>
          <div className="edit-profile-container">
            <Label required={true} htmlFor="editProfileCountry">
              Страна
            </Label>
            <Input
              id="editProfileCountry"
              ref={countryRef}
              value={dialogState.country}
              onChange={(e) =>
                setDialogState({ ...dialogState, country: e.target.value })
              }
              type="text"
              maxLength="50"
              placeholder="Введите страну"
              valid={isValid.country}
              autoComplete="new-password"
              title={isValid.country ? "" : "Поле не может быть пустым."}
            />
          </div>
          <div className="edit-profile-container">
            <Label required={true} htmlFor="editProfileBirthday">
              Дата рождения
            </Label>
            <CustomDatePicker
              id="editProfileBirthday"
              ref={birthdayRef}
              valid={isValid.birthday}
              value={
                dialogState.birthday
                  ? new Date(dialogState.birthday).toISOString().slice(0, 10)
                  : ""
              }
              onChange={(e) =>
                setDialogState({ ...dialogState, birthday: e.target.value })
              }
              autoComplete="new-password"
              title={
                isValid.birthday
                  ? ""
                  : `Дата рождения не может быть пустой и лежать вне диапазона "01.01.1900" - сегодняшняя дата`
              }
            />
          </div>
          <div className="edit-profile-container">
            <Label required={true} htmlFor="editProfileEmployment">
              Место работы/учёбы
            </Label>
            <Input
              type="text"
              ref={employmentRef}
              id="editProfileEmployment"
              valid={isValid.employment}
              name="employment"
              maxLength="100"
              value={dialogState.employment}
              onChange={(e) =>
                setDialogState({ ...dialogState, employment: e.target.value })
              }
              placeholder="Введите место работы/учёбы"
              autoComplete="new-password"
              title={isValid.employment ? "" : "Поле не может быть пустым."}
            >
              <Hint text="Например, профессор физико-математических наук, БНТУ" />
            </Input>
          </div>
          <div className="edit-profile-container">
            <Label htmlFor="editProfileThemes">Интересующие вас темы</Label>
            <Input
              type="text"
              id="editProfileThemes"
              value={dialogState.themes}
              maxLength="1000"
              onChange={(e) =>
                setDialogState({ ...dialogState, themes: e.target.value })
              }
              autoComplete="new-password"
              placeholder="Введите темы через запятую"
            >
              <Hint text="Например, наночастицы диоксида титана, квантовая механика" />
            </Input>
          </div>
          <div className="edit-profile-container">
            <Label required={true} htmlFor="editProfileStatus">
              Статус
            </Label>
            <Input
              type="text"
              ref={statusRef}
              id="editProfileStatus"
              maxLength="50"
              value={dialogState.status}
              valid={isValid.status}
              onChange={(e) =>
                setDialogState({ ...dialogState, status: e.target.value })
              }
              autoComplete="new-password"
              placeholder="Введите статус"
              title={isValid.status ? "" : "Поле не может быть пустым."}
            >
              <Hint text="Например, обучающийся или специалист" />
            </Input>
          </div>
        </div>
        <div className="dialog-buttons-container">
          <Button
            onClick={cancel}
            type="button"
            className="dialog-cancel-button"
          >
            Отменить
          </Button>
          <Button
            type="button"
            className="dialog-submit-button"
            onClick={submitForm}
          >
            Сохранить
          </Button>
        </div>
      </form>
    </div>
  );
}
