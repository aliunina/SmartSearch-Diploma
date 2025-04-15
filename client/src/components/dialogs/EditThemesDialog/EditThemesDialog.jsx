import "./EditThemesDialog.css";

import Button from "../../inputs/Button/Button";
import BusyIndicator from "../../visuals/BusyIndicator/BusyIndicator";
import Input from "../../inputs/Input/Input";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import { showErrorMessageToast } from "../../../helpers/util";

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

  const submitForm = () => {
    let valid = true;
    dialogState.themes.forEach((theme) => {
      valid = valid && theme.text?.trim().length > 0;
    });
    if (valid) {
      updateThemes(dialogState.themes);
    } else {
      showErrorMessageToast(
        "Тема не может быть пустой, исправьте пустые тематики"
      );
    }
  };

  const deleteTheme = (index) => {
    const arr = dialogState.themes;
    arr.splice(index, 1);
    setDialogState({ ...dialogState, themes: arr });
  };

  const addTheme = () => {
    const arr = dialogState.themes;
    arr.push({
      text: "",
      recentArticles: []
    });
    setDialogState({ ...dialogState, themes: arr });
  };

  return (
    <div className="darkened-background">
      <form
        className="dialog-size dialog-wrap dialog-edit-themes"
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
        <p className="dialog-title">Редактировать области интересов</p>
        <div className="dialog-content dialog-edit-themes">
          <div
            className={`${
              dialogState.themes.length === 0 ? "non-displayed" : ""
            } dialog-edit-themes-container`}
          >
            {dialogState.themes.map((theme, i) => {
              return (
                <div className="dialog-edit-themes-theme" key={i}>
                  <Input
                    className="dialog-edit-themes-input"
                    type="text"
                    maxLength="50"
                    autoComplete="off"
                    onChange={(event) => {
                      const arr = dialogState.themes;
                      arr[i] = {
                        text: event.target.value,
                        recentArticles: arr[i].recentArticles
                      };
                      setDialogState({ ...dialogState, themes: arr });
                    }}
                    value={theme.text}
                  />
                  <Button
                    type="button"
                    onClick={() => deleteTheme(i)}
                    className="default-button dialog-edit-theme-delete-button"
                  >
                    <DeleteFilled />
                  </Button>
                </div>
              );
            })}
          </div>
          <Button
            type="button"
            hidden={dialogState.themes.length === 5}
            className="dialog-edit-theme-add-button"
            onClick={addTheme}
            title="Удалить"
          >
            <PlusOutlined style={{ fontSize: "1.5em" }} />
            Добавить
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
