import "./PeriodFilter.css";
import FilterItem from "../FilterItem/FilterItem";
import { PERIOD_FILTER } from "../../constants/index";
import Button from "../Button/Button";
import { useState } from "react";

export default function PeriodFilter({
  currentFilter,
  updateFilter,
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
      <p className="filter-title">Период</p>
      {Object.keys(PERIOD_FILTER).map((el) => {
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
      })}
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
          />
        </div>
        {currentFilter.text === PERIOD_FILTER["custom"].text && (
          <Button
            type="button"
            className="custom-period-button"
            onClick={setCustomFilter}
          >
            Применить
          </Button>
        )}
      </div>
    </form>
  );
}
