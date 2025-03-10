import SearchResult from "../SearchResult/SearchResult";
import "./SearchResults.css";

export default function SearchResults({ items, isLoading }) {
  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>;
      </div>
    );
  }
  if (!items || items.length === 0) {
    return <p>Записей пока нет.</p>;
  }
  return (
    <div className="search-results">
      {items.map((el, i) => (
        <SearchResult key={i} {...el}></SearchResult>
      ))}
    </div>
  );
}
