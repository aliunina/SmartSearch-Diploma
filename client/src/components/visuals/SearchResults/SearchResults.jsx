import BusyIndicator from "../BusyIndicator/BusyIndicator";
import SearchResult from "../SearchResult/SearchResult";
import "./SearchResults.css";

export default function SearchResults({
  items,
  count,
  selectedPage,
  updatePage,
  issueText,
  isLoading,
  hideDeleteButton = true,
  hideSaveButton,
  saveToLibrary
}) {
  const setPage = (event) => {
    updatePage(Number(event.target.text));
  };

  if (isLoading) {
    return (
      <div className="results-busy-container">
        <BusyIndicator removeClasses={true} />
      </div>
    );
  }
  if (issueText) {
    return (
      <div className="issue-container">
        <img
          src="no_search_results.svg"
          className="issue-image"
          alt="Нет результатов"
        />
        <p className="issue-text">{issueText}</p>
      </div>
    );
  }
  return (
    <div className="search-results-container">
      <div className="search-results">
        {items.map((el, i) => (
          <SearchResult
            key={i}
            {...el}
            hideDeleteButton={hideDeleteButton}
            hideSaveButton={hideSaveButton}
            saveToLibrary={() => saveToLibrary(i)}
          ></SearchResult>
        ))}
      </div>
      <div className="pagination">
        {[...Array(count)].map((item, index) => (
          <a
            key={index}
            className={`page ${
              selectedPage === index + 1 ? "page-active" : ""
            }`}
            onClick={setPage}
          >
            {index + 1}
          </a>
        ))}
      </div>
    </div>
  );
}
