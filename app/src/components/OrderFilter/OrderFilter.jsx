import "./OrderFilter.css";
import FilterItem from "../FilterItem/FilterItem";

export default function OrderFilter({ currentFilter, updateFilter, ...props }) {
  const onFilterChange = (event) => {
    const newFilter = event.target.value;
    updateFilter(newFilter);
  };

  return (
    <form className="filter-container" {...props}>
      <p className="filter-title">Сортировка</p>
      <FilterItem
        checked={currentFilter === "relevance"}
        name={"relevance"}
        value={"relevance"}
        text="По релевантности"
        onChange={onFilterChange}
      />
      <FilterItem
        checked={currentFilter === "date"}
        name={"date"}
        value={"date"}
        text="По дате"
        onChange={onFilterChange}
      />
    </form>
  );
}
