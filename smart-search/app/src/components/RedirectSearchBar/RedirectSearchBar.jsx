import "./RedirectSearchBar.css";
import Button from "../Button/Button";

export default function RedirectSearchBar({ searchValue, setSearchValue, redirect }) {
  const executeSearch = (e) => {
    e.preventDefault();
    redirect(searchValue);
  };

  return (
    <form className="redirect-search-form" onSubmit={executeSearch}>
      <div className="redirect-search-container">
        <div
            className="redirect-search-icon">
            <img
            src="redirect-search.svg"
            alt="Иконка поиска"
            />
        </div>
        <input
          type="text"
          onChange={(e) => setSearchValue(e.target.value)}
          value={searchValue}
          className="redirect-search-input"
          placeholder="Введите запрос"
        />
      </div>
      <Button onClick={executeSearch} className="redirect-search-button">
        Искать
      </Button>
    </form>
  );
}
