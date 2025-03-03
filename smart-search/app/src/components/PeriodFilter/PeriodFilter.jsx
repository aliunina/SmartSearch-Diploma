import "./PeriodFilter.css";
import FilterItem from "../FilterItem/FilterItem";
import { PERIOD_FILTER } from "../../constants/index";

export default function PeriodFilter({ currentFilter, updateFilter, ...props }) {
  const onFilterChange = (event) => {
    const newFilter = event.target.value;
    updateFilter(newFilter);
  };

  return (
    <form className="period-filter" {...props}>
      <p className="filter-title">
        Период
      </p>
      <FilterItem
        checked={currentFilter === PERIOD_FILTER.All}
        name={PERIOD_FILTER.All}
        value={PERIOD_FILTER.All}
        text="За всё время"
        onChange={onFilterChange}
      />
      <FilterItem
        checked={currentFilter === PERIOD_FILTER.Month}
        name={PERIOD_FILTER.Month}
        value={PERIOD_FILTER.Month}
        text="Месяц"
        onChange={onFilterChange}
      />
      <FilterItem
        checked={currentFilter === PERIOD_FILTER.Quarter}
        name={PERIOD_FILTER.Quarter}
        value={PERIOD_FILTER.Quarter}
        text="3 месяца"
        onChange={onFilterChange}
      />
      <FilterItem
        checked={currentFilter === PERIOD_FILTER.HalfYear}
        name={PERIOD_FILTER.HalfYear}
        value={PERIOD_FILTER.HalfYear}
        text="Полгода"
        onChange={onFilterChange}
      />
      <FilterItem
        checked={currentFilter === PERIOD_FILTER.Year}
        name={PERIOD_FILTER.Year}
        value={PERIOD_FILTER.Year}
        text="Год"
        onChange={onFilterChange}
      />
      <FilterItem
        checked={currentFilter === PERIOD_FILTER.Custom}
        name={PERIOD_FILTER.Custom}
        value={PERIOD_FILTER.Custom}
        text="Свой период"
        onChange={onFilterChange}
      />
      <div className="custom-period">
        <input type="text" maxLength="4" minLength="4" placeholder="от"/>
        <span style={{marginLeft: "0.5em", marginRight: "0.5em"}}>—</span>
        <input type="text" maxLength="4" minLength="4" placeholder="до"/>
      </div>
    </form>
  );
}
