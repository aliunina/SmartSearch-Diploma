import "./EditProfileDialog.css";

import Button from "../../inputs/Button/Button";
import Input from "../../inputs/Input/Input";
import Hint from "../../visuals/Hint/Hint";
import Label from "../../visuals/Label/Label";
import CustomDatePicker from "../../inputs/CustomDatePicker/CustomDatePicker";
import { useEffect, useRef, useState } from "react";
import BusyIndicator from "../../visuals/BusyIndicator/BusyIndicator";
import { DeleteFilled } from "@ant-design/icons";

export default function EditProfileDialog({
  dialogBusy,
  dialogState,
  setDialogState,
  setDialogOpen,
  updateUser,
  deleteUser
}) {
  const [isValid, setIsValid] = useState({
    lastName: true,
    firstName: true,
    country: true,
    employment: true,
    status: true
  });

  const lastNameRef = useRef();
  const firstNameRef = useRef();
  const statusRef = useRef();
  const countryRef = useRef();
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
          <BusyIndicator />
        </div>
      )}
      <form className="dialog-size dialog-wrap" onSubmit={submitForm}>
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
              autoComplete="off"
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
              autoComplete="off"
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
              autoComplete="off"
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
              autoComplete="off"
              title={isValid.country ? "" : "Поле не может быть пустым."}
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
              autoComplete="off"
              title={isValid.employment ? "" : "Поле не может быть пустым."}
            >
              <Hint text="Например, профессор физико-математических наук, БНТУ" />
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
              autoComplete="off"
              placeholder="Введите статус"
              title={isValid.status ? "" : "Поле не может быть пустым."}
            >
              <Hint text="Например, обучающийся или специалист" />
            </Input>
          </div>
          <Button className="transparent-button delete-profile-button" type="button" onClick={deleteUser}>
            <DeleteFilled />
            Удалить профиль
          </Button>
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
