import "./PeriodFilter.css";
import FilterItem from "../FilterItem/FilterItem";
import { PERIOD_FILTER } from "../../constants/index";
import { getFilterQuery } from "../../helpers/period-filter";
import { useLocation } from "react-router-dom";


export default function PeriodFilter({ currentFilter, updateFilter, ...props }) {
  const location = useLocation();
  const onFilterChange = (event) => {
    const newFilter = event.target.value;
    updateFilter(newFilter);
    
    // const filterQuery = getFilterQuery(newFilter);
    // window.location = location.pathname + location.hash.split('+after:')[0] + filterQuery;
  };

  return (
    <form className="period-filter" {...props}>
      <p className="filter-title">
        Период
      </p>
      <FilterItem
        checked={currentFilter === PERIOD_FILTER.All.key}
        name={PERIOD_FILTER.All.key}
        value={PERIOD_FILTER.All.key}
        text="За всё время"
        onChange={onFilterChange}
      />
      <FilterItem
        checked={currentFilter === PERIOD_FILTER.Month.key}
        name={PERIOD_FILTER.Month.key}
        value={PERIOD_FILTER.Month.key}
        text="Месяц"
        onChange={onFilterChange}
      />
      <FilterItem
        checked={currentFilter === PERIOD_FILTER.Quarter.key}
        name={PERIOD_FILTER.Quarter.key}
        value={PERIOD_FILTER.Quarter.key}
        text="3 месяца"
        onChange={onFilterChange}
      />
      <FilterItem
        checked={currentFilter === PERIOD_FILTER.HalfYear.key}
        name={PERIOD_FILTER.HalfYear.key}
        value={PERIOD_FILTER.HalfYear.key}
        text="Полгода"
        onChange={onFilterChange}
      />
      <FilterItem
        checked={currentFilter === PERIOD_FILTER.Year.key}
        name={PERIOD_FILTER.Year.key}
        value={PERIOD_FILTER.Year.key}
        text="Год"
        onChange={onFilterChange}
      />
      <FilterItem
        checked={currentFilter === PERIOD_FILTER.Custom.key}
        name={PERIOD_FILTER.Custom.key}
        value={PERIOD_FILTER.Custom.key}
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
