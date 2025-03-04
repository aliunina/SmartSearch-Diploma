import "./RedirectSearchBar.css";
import { useState } from "react";
import Button from "../Button/Button";

export default function RedirectSearchBar() {
  const [searchValue, setSearchValue] = useState("");

  const executeSearch = (e) => {
    e.preventDefault();
    const hash = `gsc.tab=0&gsc.q=${searchValue}&gsc.page=1`;
    window.location = "/search" + '#' + hash;
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
