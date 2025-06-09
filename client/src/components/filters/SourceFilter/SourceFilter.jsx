import "./SourceFilter.css";
import FilterItem from "../../inputs/FilterItem/FilterItem";
import { getSourceFilter, isSourceFilterLoaded } from "../../../utils/sourceFilter";

export default function SourceFilter({
  currentFilter,
  updateFilter,
  ...props
}) {
  const onFilterChange = (event) => {
    const newFilter = event.target.value;
    updateFilter(getSourceFilter()[newFilter]);
  };

  return (
    <form className="filter-container" {...props}>
      <p className="filter-title">Источник</p>
      {isSourceFilterLoaded() &&
        Object.keys(getSourceFilter()).map((el) => {
          return (
            <FilterItem
              key={getSourceFilter()[el].url}
              checked={currentFilter?.text === getSourceFilter()[el].text}
              name={getSourceFilter()[el].text}
              value={el}
              text={getSourceFilter()[el].text}
              onChange={onFilterChange}
            />
          );
        })}
    </form>
  );
}
