import { useEffect, useState } from "react";
import Button from "../Button/Button";
import "./SearchBar.css";
import ExtendedSearchDialog from "../../dialogs/ExtendedSearchDialog/ExtendedSearchDialog";

export default function SearchBar({ search, extendedSearch, dialogOpen, setDialogOpen, resetFilters }) {
  const [searchValue, setSearchValue] = useState("");
  const [dialogState, setDialogState] = useState({});

  useEffect(() => {
    const urlParams = Object.fromEntries(
      new URLSearchParams(window.location.search)
    );
    if (urlParams.q) {
      setSearchValue(decodeURI(urlParams.q));
    }
  }, []);

  const executeSearch = (e) => {
    e.preventDefault();
    search(searchValue);
  };

  const clearSearch = () => {
    setSearchValue("");
    resetFilters();
  };

  const openExtendedSearchDialog = () => {
    const urlParams = Object.fromEntries(
      new URLSearchParams(window.location.search)
    );
    const filterKeys = ["hq", "exactTerms", "excludeTerms", "orTerms", "sort", "authors"];
    const result = {};
    filterKeys.forEach((key) => {
      if (key === "sort") {
        if (urlParams.sort?.includes(":r:")) {
          const dateFrom = urlParams.sort.split(":")[2];
          const dateTo = urlParams.sort.split(":")[3];
          result.dateFrom = `${dateFrom.slice(0, 4)}-${dateFrom.slice(
            5,
            7
          )}-${dateFrom.slice(8)}`;
          result.dateTo = `${dateTo.slice(0, 4)}-${dateTo.slice(
            5,
            7
          )}-${dateTo.slice(8)}`;
        }
      } else if (urlParams[key]) {
        result[key] = urlParams[key];
      }
    });
    setDialogState(result);
    setDialogOpen(true);
  };

  const handleExtendedSearch = (filters) => {
    setDialogOpen(false);
    extendedSearch(filters);
  };

  const handleSearchQueryChange = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <>
      <form className="search-form" onSubmit={executeSearch}>
        <input
          type="search"
          maxLength="2048"
          onChange={handleSearchQueryChange}
          value={searchValue}
          name="searchBar"
          className="search-input"
          placeholder="Поиск"
        />
        <Button className="cross-button" title="Очистить" type="button" onClick={clearSearch}>
          <img src="cross.svg" alt="Очистить" />
        </Button>
        <Button className="search-button" title="Искать" type="button" onClick={executeSearch}>
          <img src="search.svg" alt="Искать" />
        </Button>
        <div className="divider">
          <img src="divider.svg" />
        </div>
        <Button
          type="button"
          title="Расширенный поиск" 
          className="extended-search-button"
          onClick={openExtendedSearchDialog}
        >
          <img src="extended_search.svg" alt="Расширенный поиск" />
        </Button>
      </form>
      {dialogOpen && (
        <ExtendedSearchDialog
          dialogState={dialogState}
          setDialogOpen={setDialogOpen}
          setDialogState={setDialogState}
          extendedSearch={handleExtendedSearch}
        />
      )}
    </>
  );
}
