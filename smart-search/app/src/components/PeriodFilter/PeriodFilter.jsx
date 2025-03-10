import "./PeriodFilter.css";
import FilterItem from "../FilterItem/FilterItem";
import { PERIOD_FILTER } from "../../constants/index";

export default function PeriodFilter({
  currentFilter,
  updateFilter,
  ...props
}) {
  const onFilterChange = (event) => {
    const newFilter = event.target.value;
    updateFilter(PERIOD_FILTER[newFilter]);
  };

  return (
    <form className="filter-container" {...props}>
      <p className="filter-title">Период</p>
      <FilterItem
        checked={currentFilter.name === PERIOD_FILTER["all"].name}
        name={PERIOD_FILTER["all"].name}
        value={PERIOD_FILTER["all"].name}
        text="За всё время"
        onChange={onFilterChange}
      />
      <FilterItem
        checked={currentFilter.name === PERIOD_FILTER["month"].name}
        name={PERIOD_FILTER["month"].name}
        value={PERIOD_FILTER["month"].name}
        text="Месяц"
        onChange={onFilterChange}
      />
      <FilterItem
        checked={currentFilter.name === PERIOD_FILTER["quarter"].name}
        name={PERIOD_FILTER["quarter"].name}
        value={PERIOD_FILTER["quarter"].name}
        text="3 месяца"
        onChange={onFilterChange}
      />
      <FilterItem
        checked={currentFilter.name === PERIOD_FILTER["half-year"].name}
        name={PERIOD_FILTER["half-year"].name}
        value={PERIOD_FILTER["half-year"].name}
        text="Полгода"
        onChange={onFilterChange}
      />
      <FilterItem
        checked={currentFilter.name === PERIOD_FILTER["year"].name}
        name={PERIOD_FILTER["year"].name}
        value={PERIOD_FILTER["year"].name}
        text="Год"
        onChange={onFilterChange}
      />
      <FilterItem
        checked={currentFilter.name === PERIOD_FILTER["custom"].name}
        name={PERIOD_FILTER["custom"].name}
        value={PERIOD_FILTER["custom"].name}
        text="Свой период"
        onChange={onFilterChange}
      />
      <div className="custom-period">
        <input
          type="text"
          maxLength="4"
          pattern="[0-9]*"
          disabled={currentFilter.name !== PERIOD_FILTER["custom"].name}
          minLength="4"
          placeholder="от"
        />
        <span style={{ marginLeft: "0.5em", marginRight: "0.5em" }}>—</span>
        <input
          type="text"
          maxLength="4"
          pattern="[0-9]*"
          disabled={currentFilter.name !== PERIOD_FILTER["custom"].name}
          minLength="4"
          placeholder="до"
        />
      </div>
    </form>
  );
}
