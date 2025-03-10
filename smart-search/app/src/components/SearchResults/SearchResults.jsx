import "./SearchResults.css";

export default function SearchResults() {
  return (
    <>
      <script
        async
        src="https://cse.google.com/cse.js?cx=00f258b706ba54cf3"
      ></script>
        <div className="custom-gcse-styles">
        <div className="gcse-searchresults-only" data-gl="ru"></div>
      </div>
    </>
  );
}
