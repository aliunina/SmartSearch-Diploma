import Header from "../../layouts/SearchPage/Header/Header";
import LeftPanel from "../../layouts/SearchPage/LeftPanel/LeftPanel";
import Body from "../../layouts/SearchPage/Body/Body";

import SearchResults from "../../components/SearchResults/SearchResults";
import SearchBar from "../../components/SearchBar/SearchBar";
import Logo from "../../components/Logo/Logo";
import Avatar from "../../components/Avatar/Avatar";
import PeriodFilter from "../../components/PeriodFilter/PeriodFilter";

import { PERIOD_FILTER, SEARCH_ENGINE } from "../../constants/index";
import {  } from "../../helpers/util";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import OrderFilter from "../../components/OrderFilter/OrderFilter";

export default function Search() {
  const location = useLocation();
  const [urlParams, setUrlParams] = useState({});

  const [orderFilter, setOrderFilter] = useState("relevance");
  const [periodFilter, setPeriodFilter] = useState(PERIOD_FILTER.all);

  const [appState, setAppState] = useState({
    isLoading: false,
    items: []
  });

  useEffect(() => {
    const urlParams = Object.fromEntries(new URLSearchParams(location.search));
    setUrlParams(urlParams);
    if (urlParams.dateRestrict) {
      const periodFilter = Object.keys(PERIOD_FILTER).find(
        (key) => PERIOD_FILTER[key].value === urlParams.dateRestrict
      );
      setPeriodFilter(PERIOD_FILTER[periodFilter]);
    }
    if (urlParams.sort === "date") {
      setOrderFilter("date");
    }
  }, [location.search]);

  const handlePeriodFilterUpdate = useCallback(
    (newFilter, from, to) => {
      setPeriodFilter(newFilter);
      if (newFilter.name === "all") {
        let newFilters = {...urlParams};
        delete newFilters.dateRestrict;
        setUrlParams(newFilters);
      } else if (newFilter.name === "custom") {
        if (from && to) {
          let newFilters = {...urlParams};
          delete newFilters.dateRestrict;
          delete newFilters.sort;
          setUrlParams({
            ...urlParams,
            sort: `date:r:${from}0101:${to}1231`
          });
        }
      } else {
        setUrlParams({
          ...urlParams,
          dateRestrict: newFilter.value
        });
      }
    },
    [urlParams]
  );

  const handleOrderFilterUpdate = useCallback(
    (newFilter) => {
      setOrderFilter(newFilter);  
      if (newFilter === "date") {
        setUrlParams({
          ...urlParams,
          sort: "date"
        });
      } else {
        let newFilters = {...urlParams};
        delete newFilters.sort;
        setUrlParams(newFilters);
      }
    },
    [urlParams]
  );

  useEffect(() => {
    if (urlParams.q) {
      setAppState({
        isLoading: true
      });
      const fullParams = new URLSearchParams({
        cx: SEARCH_ENGINE.cx,
        key: SEARCH_ENGINE.key,
        ...urlParams
      });
      axios
        .get(`${SEARCH_ENGINE.url}?${fullParams.toString()}`)
        .then((response) => {
          const results = response.data.items;
          if ((new URLSearchParams(urlParams)).toString() !== location.search.split('?')[1]) {
            history.pushState(
              null,
              null,
              location.pathname + "?" + new URLSearchParams(urlParams).toString()
            );
          }
          setAppState({
            isLoading: false,
            items: results
          });
        })
        .catch((error) => {
          console.log("Error: " + error);
        });
    }
  }, [setAppState, urlParams, location.search, location.pathname]);

  return (
    <>
      <Header>
        <Logo />
        <SearchBar
          search={(searchValue) => {
            setUrlParams({
              ...urlParams,
              q: searchValue
            });
          }}
        />
        <Avatar />
      </Header>
      <div className="main">
        <LeftPanel>
          <OrderFilter
            currentFilter={orderFilter}
            updateFilter={handleOrderFilterUpdate}
          />
          <PeriodFilter
            currentFilter={periodFilter}
            updateFilter={handlePeriodFilterUpdate}
          />
        </LeftPanel>
        <Body>
          <SearchResults
            isLoading={appState.isLoading}
            items={appState.items}
          />
        </Body>
      </div>
    </>
  );
}
