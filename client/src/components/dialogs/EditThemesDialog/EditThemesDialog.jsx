import "./EditThemesDialog.css";

import Button from "../../inputs/Button/Button";
import BusyIndicator from "../../visuals/BusyIndicator/BusyIndicator";
import Input from "../../inputs/Input/Input";

export default function EditThemesDialog({
  dialogBusy,
  dialogState,
  setDialogState,
  setDialogOpen,
  updateThemes
}) {
  const close = () => {
    setDialogOpen(false);
  };

  const cancel = () => {
    setDialogOpen(false);
  };

  const submitForm = () => {};

  const deleteTheme = (index) => {};

  return (
    <div className="darkened-background">
      {dialogBusy && (
        <div className="dialog-size dialog-busy-background dialog-edit-themes">
          <BusyIndicator />
        </div>
      )}
      <form
        className="dialog-size dialog-wrap dialog-edit-themes"
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
        <p className="dialog-title">Редактировать области интересов</p>
        <div className="dialog-content dialog-edit-themes">
          <div className="dialog-edit-themes-container">
            {dialogState.themes.map((theme, i) => {
              return (
                <div className="dialog-edit-themes-theme" key={i}>
                  <Input
                    className="dialog-edit-themes-input"
                    type="text"
                    maxLength="20"
                    value={theme.text}
                  />
                  <Button onClick={() => deleteTheme(i)}></Button>
                </div>
              );
            })}
          </div>
          <Button>Добавить</Button>
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
