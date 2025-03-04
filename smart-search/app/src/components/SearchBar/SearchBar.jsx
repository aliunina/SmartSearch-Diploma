import { useEffect, useState } from "react";
import Button from "../Button/Button";
import "./SearchBar.css";
import { useLocation } from "react-router-dom";

export default function SearchBar() {
  let query;
  const location = useLocation();
  const [hash, setHash] = useState(null);

  location.hash.split("&").forEach(elem => {
    const key = elem.split("=")[0];
    if (key === "gsc.q") {
      query = decodeURI(elem.split("=")[1]);
    }
  });

  const [searchValue, setSearchValue] = useState(query);

  useEffect(() => {
    if (hash) {
      window.location = location.pathname + '#' + hash;
    }
  }, [location.pathname, hash]);

  const executeSearch = (e) => {
    e.preventDefault();
    setHash(`gsc.tab=0&gsc.q=${searchValue}&gsc.page=1`);
  };

  const clearSearch = () => {
    setHash(null);
  };

  return (
    <form className="search-form" onSubmit={executeSearch}>
      <input
        type="text"
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
