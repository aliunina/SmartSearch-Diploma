import "./ExtendedSearchDialog.css";

import Button from "../../inputs/Button/Button";
import Input from "../../inputs/Input/Input";
import Hint from "../../visuals/Hint/Hint";
import CustomDatePicker from "../../inputs/CustomDatePicker/CustomDatePicker";

import { getFormmattedDate } from "../../../helpers/util";

export default function ExtendedSearchDialog({
  dialogState,
  setDialogState,
  setDialogOpen,
  extendedSearch
}) {
  const submitForm = (event) => {
    event.preventDefault();
    const formProps = Object.fromEntries(new FormData(event.target));
    const result = {};
    Object.keys(formProps).forEach((key) => {
      if (key === "dateFrom") {
        const dateFrom = getFormmattedDate(
          Math.min(new Date(formProps.dateFrom), new Date(formProps.dateTo))
        );
        const dateTo = getFormmattedDate(
          Math.max(new Date(formProps.dateFrom), new Date(formProps.dateTo))
        );
        const dateNow = getFormmattedDate(Date.now());
        if (formProps.dateFrom && formProps.dateTo) {
          result.sort = `date:r:${dateFrom}:${dateTo}`;
        } else if (formProps.dateFrom) {
          result.sort = `date:r:${dateFrom}:${dateNow}`;
        } else if (formProps.dateTo) {
          result.sort = `date:r:${dateTo}:${dateNow}`;
        }
      } else if (key === "dateTo") {
        return;
      } else if (formProps[key]) {
        result[key] = formProps[key];
      }
    });
    extendedSearch(result);
  };

  const close = () => {
    setDialogOpen(false);
  };

  const clear = () => {
    setDialogState({
      hq: "",
      exactTerms: "",
      orTerms: "",
      excludeTerms: "",
      dateFrom: "",
      dateTo: "",
      authors: ""
    });
  };

  return (
    <div className="darkened-background">
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
        <p className="dialog-title">Расширенный поиск</p>
        <div className="dialog-content">
          <p className="filter-title">Содержит:</p>
          <Input
            value={dialogState.hq}
            onChange={(e) =>
              setDialogState({ ...dialogState, hq: e.target.value })
            }
            name="hq"
            type="text"
            placeholder="Все эти слова"
          >
            <Hint text="Пример: что происходит · Содержит и «что», и «происходит»" />
          </Input>
          <Input
            value={dialogState.exactTerms}
            onChange={(e) =>
              setDialogState({ ...dialogState, exactTerms: e.target.value })
            }
            name="exactTerms"
            type="text"
            placeholder="Точная фраза"
          >
            <Hint text="Пример: интересная книга · Содержит точную фразу «интересная книга»" />
          </Input>
          <Input
            value={dialogState.orTerms}
            onChange={(e) =>
              setDialogState({ ...dialogState, orTerms: e.target.value })
            }
            name="orTerms"
            type="text"
            placeholder="Любое из этих слов"
          >
            <Hint text="Пример: кошки собаки · Содержит либо «кошки», либо «собаки» (или оба слова)" />
          </Input>
          <Input
            name="excludeTerms"
            value={dialogState.excludeTerms}
            onChange={(e) =>
              setDialogState({ ...dialogState, excludeTerms: e.target.value })
            }
            type="text"
            placeholder="Не содержит слово/фразу"
          >
            <Hint text="Пример: кошки собаки · Не содержит «кошки собаки»" />
          </Input>
          <p className="filter-title">Авторы</p>
          <Input
            type="text"
            name="authors"
            value={dialogState.authors}
            onChange={(e) =>
              setDialogState({ ...dialogState, authors: e.target.value })
            }
            placeholder="Статьи этих авторов"
          >
            <Hint text="Например, Семенов или Каплан. · Содержит статьи авторства либо «Семенова», либо «Каплана» (или обоих авторов) " />
          </Input>
          <p className="filter-title">Период</p>
          <div>
            <div className="dialog-period-container">
              <CustomDatePicker
                name="dateFrom"
                value={dialogState.dateFrom}
                onChange={(e) => {
                  setDialogState({ ...dialogState, dateFrom: e.target.value });
                }}
                placeholder="От"
              />
              <span>—</span>
              <CustomDatePicker
                name="dateTo"
                value={dialogState.dateTo}
                onChange={(e) => {
                  setDialogState({ ...dialogState, dateTo: e.target.value });
                }}
                placeholder="До"
              />
            </div>
            <Hint text="Пример: 01.03.2010 — 31.04.2010 · Содержит статьи за март и апрель 2010-го»" />
          </div>
        </div>
        <div className="dialog-buttons-container">
          <Button onClick={clear} type="button" className="dialog-cancel-button">
            Очистить
          </Button>
          <Button className="dialog-submit-button">Поиск</Button>
        </div>
      </form>
    </div>
  );
}
