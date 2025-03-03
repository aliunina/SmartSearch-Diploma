import "./App.css";
import SearchResults from "./components/SearchResults/SearchResults";
import SearchBar from "./components/SearchBar/SearchBar";
import Logo from "./components/Logo/Logo";
import Header from "./layouts/Header/Header";
import LeftPanel from "./layouts/LeftPanel/LeftPanel";
import Body from "./layouts/Body/Body";
import PeriodFilter from "./components/PeriodFilter/PeriodFilter";
import { PERIOD_FILTER } from "./constants/index";
import { useState, useCallback } from "react";

export default function App() {
  const [periodFilter, setPeriodFilter] = useState(PERIOD_FILTER.All);

  const handlePeriodFilterUpdate = useCallback((newFilter) => {
    setPeriodFilter(newFilter);
  }, []);

  return (
    <div className="app">
      <Header>
        <Logo/>
        <SearchBar/>
      </Header>
      <div className="main">
        <LeftPanel>
          <PeriodFilter
            currentFilter={periodFilter}
            updateFilter={handlePeriodFilterUpdate}
          />
        </LeftPanel>
        <Body>
          <SearchResults/>
        </Body>
      </div>
    </div>
  );
}
