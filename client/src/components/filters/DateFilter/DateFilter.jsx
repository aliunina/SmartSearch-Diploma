import "./DateFilter.css";
import FilterItem from "../../inputs/FilterItem/FilterItem";

export default function DateFilter({ currentFilter, updateFilter, ...props }) {
  const onFilterChange = (event) => {
    const newFilter = event.target.value;
    updateFilter(newFilter);
  };

  return (
    <form className="filter-container" {...props}>
      <p className="filter-title">Сортировка по времени добавления</p>
      <FilterItem
        checked={currentFilter === "new"}
        name="new"
        value="new"
        text="Сначала новые"
        onChange={onFilterChange}
      />
      <FilterItem
        checked={currentFilter === "old"}
        name="old"
        value="old"
        text="Сначала старые"
        onChange={onFilterChange}
      />
    </form>
  );
}
