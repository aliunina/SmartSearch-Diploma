import Header from "../../layouts/SearchPage/Header/Header";
import LeftPanel from "../../layouts/SearchPage/LeftPanel/LeftPanel";
import Body from "../../layouts/SearchPage/Body/Body";

import SearchResults from "../../components/SearchResults/SearchResults";
import SearchBar from "../../components/SearchBar/SearchBar";
import Logo from "../../components/Logo/Logo";
import Avatar from "../../components/Avatar/Avatar";
import PeriodFilter from "../../components/PeriodFilter/PeriodFilter";

import { PERIOD_FILTER } from "../../constants/index";

import { useState, useCallback } from "react";

export default function Search() {
  const [periodFilter, setPeriodFilter] = useState(PERIOD_FILTER.All.key);

  const handlePeriodFilterUpdate = useCallback((newFilter) => {
    setPeriodFilter(newFilter);
  }, []);

  return (
    <>
      <Header>
        <Logo />
        <SearchBar />
        <Avatar />
      </Header>
      <div className="main">
        <LeftPanel>
          <PeriodFilter
            currentFilter={periodFilter}
            updateFilter={handlePeriodFilterUpdate}
          />
        </LeftPanel>
        <Body>
          <SearchResults />
        </Body>
      </div>
    </>
  );
}
