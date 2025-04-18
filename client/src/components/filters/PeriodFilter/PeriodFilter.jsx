import "./PeriodFilter.css";
import FilterItem from "../../inputs/FilterItem/FilterItem";
import { PERIOD_FILTER } from "../../../constants/index";
import Button from "../../inputs/Button/Button";
import { useState } from "react";

export default function PeriodFilter({
  title,
  currentFilter,
  updateFilter,
  showCustomPeriod = true,
  changeFrom,
  changeTo,
  from,
  to,
  ...props
}) {
  const [validFrom, setValidFrom] = useState(true);
  const [validTo, setValidTo] = useState(true);

  const onFilterChange = (event) => {
    const newFilter = event.target.value;
    updateFilter(PERIOD_FILTER[newFilter]);
  };

  const onChangeFrom = (event) => {
    changeFrom(event.target.value);
  };

  const onChangeTo = (event) => {
    changeTo(event.target.value);
  };

  const setCustomFilter = () => {
    const yearRegExp = /^[1-9][0-9]{3}$/;
    setValidFrom(yearRegExp.test(from));
    setValidTo(yearRegExp.test(to));
    if (validFrom && validTo) {
      updateFilter(
        PERIOD_FILTER["custom"],
        Math.min(from, to),
        Math.max(from, to)
      );
    }
  };

  return (
    <form className="filter-container" {...props}>
      <p className="filter-title">{title}</p>
      {Object.keys(PERIOD_FILTER).map((el) => {
        if (!(!showCustomPeriod && el === "custom")) {
          return (
            <FilterItem
              key={PERIOD_FILTER[el].value}
              checked={currentFilter.text === PERIOD_FILTER[el].text}
              name={PERIOD_FILTER[el].text}
              value={el}
              text={PERIOD_FILTER[el].text}
              onChange={onFilterChange}
            />
          );
        }
      })}
      {showCustomPeriod && (
        <div className="custom-period-container">
          <div className="custom-period-inputs">
            <input
              type="text"
              maxLength="4"
              className={`custom-period-input ${
                validFrom ? "" : "custom-period-input-invalid"
              }`}
              pattern="[0-9]*"
              value={from}
              onChange={onChangeFrom}
              disabled={currentFilter.text !== PERIOD_FILTER["custom"].text}
              placeholder="от"
              title={validFrom ? "" : "Год должен состоять из 4 цифр."}
            />
            <span style={{ marginLeft: "0.5em", marginRight: "0.5em" }}>—</span>
            <input
              type="text"
              maxLength="4"
              pattern="[0-9]*"
              value={to}
              onChange={onChangeTo}
              className={`custom-period-input ${
                validTo ? "" : "custom-period-input-invalid"
              }`}
              disabled={currentFilter.text !== PERIOD_FILTER["custom"].text}
              placeholder="до"
              title={validTo ? "" : "Год должен состоять из 4 цифр."}
            />
          </div>
          {currentFilter.text === PERIOD_FILTER["custom"].text && (
            <Button
              type="button"
              className="transparent-button"
              onClick={setCustomFilter}
            >
              Применить
            </Button>
          )}
        </div>
      )}
    </form>
  );
}
