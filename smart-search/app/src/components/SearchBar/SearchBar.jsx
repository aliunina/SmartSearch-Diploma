import { useEffect, useState } from "react";
import Button from "../Button/Button";
import "./SearchBar.css";
import { useLocation } from "react-router-dom";

export default function SearchBar({search}) {
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {  
    const urlParams = Object.fromEntries(new URLSearchParams(location.search));
    if (urlParams.q) {
      setSearchValue(decodeURI(urlParams.q));
    }
  }, [location.search]);

  const executeSearch = (e) => {
    e.preventDefault();
    search(searchValue);
  };

  const clearSearch = () => {
    ////TO DO
  };

  return (
    <form className="search-form" onSubmit={executeSearch}>
      <input
        type="text"
        maxLength="2048"
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
        name="searchBar"
        className="search-input"
        placeholder="Поиск"
      />
      <Button className="cross-button" onClick={clearSearch}>
        <img src="cross.svg" alt="Очистить"/>
      </Button>
      <Button className="search-button" onClick={executeSearch}>
        <img src="search.svg" alt="Искать"/>
      </Button>
      <div className="divider">
        <img src="divider.svg" />
      </div>
      <Button className="extended-search-button">
        <img src="extended_search.svg" alt="Расширенный поиск"/>
      </Button>
    </form>
  );
}
