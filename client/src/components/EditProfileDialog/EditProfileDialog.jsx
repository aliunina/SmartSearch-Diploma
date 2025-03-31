import "./EditProfileDialog.css";

import Button from "../Button/Button";
import Input from "../Input/Input";
import Hint from "../Hint/Hint";

export default function EditProfileDialog({
  dialogState,
  setDialogState,
  setDialogOpen,
  saveUser
}) {
  const close = () => {
    setDialogOpen(false);
  };

  const cancel = () => {
    setDialogOpen(false);
  };

  return (
    <div className="dialog-background">
      <form className="dialog-wrap" onSubmit={saveUser}>
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
          <Input
            value={dialogState.lastName}
            onChange={(e) =>
              setDialogState({ ...dialogState, lastName: e.target.value })
            }
            name="hq"
            type="text"
            placeholder="Фамилия"
          >
          </Input>
          <Input
            value={dialogState.firstName}
            onChange={(e) =>
              setDialogState({ ...dialogState, firstName: e.target.value })
            }
            name="hq"
            type="text"
            placeholder="Имя"
          >
          </Input>
          <Input
            value={dialogState.patronymic}
            onChange={(e) =>
              setDialogState({ ...dialogState, patronymic: e.target.value })
            }
            name="hq"
            type="text"
            placeholder="Отчество"
          >
          </Input>
        </div>
        <div className="dialog-buttons-container">
          <Button
            onClick={cancel}
            type="button"
            className="dialog-cancel-button"
          >
            Отменить
          </Button>
          <Button className="dialog-submit-button">Сохранить</Button>
        </div>
      </form>
    </div>
  );
}
