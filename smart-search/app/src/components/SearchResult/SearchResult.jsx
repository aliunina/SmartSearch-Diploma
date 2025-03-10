import "./SearchResult.css";

export default function SearchResult({ link, displayLink, title, snippet }) {
  return (
    <div className="search-result-container">
      <a className="search-result-title" target="_blank" href={link}>{title}</a>
      <a className="search-result-site" target="_blank" href={link}>{displayLink}</a>
      <p className="search-result-snippet">{snippet}</p>
    </div>
  );
}