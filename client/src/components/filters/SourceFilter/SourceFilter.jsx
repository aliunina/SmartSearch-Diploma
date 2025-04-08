import "./SourceFilter.css";
import FilterItem from "../../inputs/FilterItem/FilterItem";
import { SOURCE_FILTER } from "../../../constants";

export default function SourceFilter({ currentFilter, updateFilter, ...props }) {
  const onFilterChange = (event) => {
    const newFilter = event.target.value;
    updateFilter(SOURCE_FILTER[newFilter]);
  };

  return (
    <form className="filter-container" {...props}>
      <p className="filter-title">Источник</p>
      {Object.keys(SOURCE_FILTER).map((el) => {
        return (
          <FilterItem
            key={SOURCE_FILTER[el].url}
            checked={currentFilter.text === SOURCE_FILTER[el].text}
            name={SOURCE_FILTER[el].text}
            value={el}
            text={SOURCE_FILTER[el].text}
            onChange={onFilterChange}
          />
        );
      })}
    </form>
  );
}
