import "./Search.css";
import Header from "../../layouts/SearchLayout/Header/Header";
import LeftPanel from "../../layouts/SearchLayout/LeftPanel/LeftPanel";
import Body from "../../layouts/SearchLayout/Body/Body";

import SearchResults from "../../components/SearchResults/SearchResults";
import SearchBar from "../../components/SearchBar/SearchBar";
import Logo from "../../components/Logo/Logo";
import NavMenu from "../../components/NavMenu/NavMenu";
import Avatar from "../../components/Avatar/Avatar";
import PeriodFilter from "../../components/PeriodFilter/PeriodFilter";

import {
  PERIOD_FILTER,
  SEARCH_ENGINE,
  SOURCE_FILTER
} from "../../constants/index";
import { getPagesCount, showErrorMessageToast } from "../../helpers/util";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import OrderFilter from "../../components/OrderFilter/OrderFilter";
import SourceFilter from "../../components/SourceFilter/SourceFilter";

export default function Search() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [urlParams, setUrlParams] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [orderFilter, setOrderFilter] = useState("relevance");
  const [periodFilter, setPeriodFilter] = useState(PERIOD_FILTER.all);
  const [sourceFilter, setSourceFilter] = useState(SOURCE_FILTER.all);

  const [appState, setAppState] = useState({
    isLoading: false,
    items: [],
    count: 0,
    issueText: null
  });

  useEffect(() => {
    const urlParams = Object.fromEntries(
      new URLSearchParams(window.location.search.split("?")[1])
    );
    setUrlParams(urlParams);

    if (urlParams.siteSearch) {
      const sourceFilter = Object.keys(SOURCE_FILTER).find((key) => {
        return SOURCE_FILTER[key].url === urlParams.siteSearch;
      });
      setSourceFilter(SOURCE_FILTER[sourceFilter]);
    }

    if (urlParams.dateRestrict) {
      const periodFilter = Object.keys(PERIOD_FILTER).find(
        (key) => PERIOD_FILTER[key].value === urlParams.dateRestrict
      );
      setPeriodFilter(PERIOD_FILTER[periodFilter]);
    }

    if (urlParams.sort === "date") {
      setOrderFilter("date");
    }

    if (urlParams.sort?.includes(":r:")) {
      setPeriodFilter(PERIOD_FILTER["custom"]);
      setFrom(urlParams.sort.split(":")[2].slice(0, 4));
      setTo(urlParams.sort.split(":")[3].slice(0, 4));
    }

    if (urlParams.start) {
      setPage(Math.ceil(Number(urlParams.start) / 10));
    }
  }, []);

  const handlePeriodFilterUpdate = useCallback(
    (newFilter, from, to) => {
      setPeriodFilter(newFilter);
      setPage(1);

      let newFilters = { ...urlParams };
      delete newFilters.dateRestrict;
      delete newFilters.start;
      if (urlParams.sort?.includes(":r:")) {
        delete newFilters.sort;
      }

      if (newFilter.text === PERIOD_FILTER.all.text) {
        setUrlParams(newFilters);
      } else if (newFilter.text === PERIOD_FILTER.custom.text) {
        if (from && to) {
          setUrlParams({
            ...newFilters,
            sort: `date:r:${from}0101:${to}1231`
          });
        }
      } else {
        setUrlParams({
          ...newFilters,
          dateRestrict: newFilter.value
        });
      }
    },
    [urlParams]
  );

  const handleOrderFilterUpdate = useCallback(
    (newFilter) => {
      setOrderFilter(newFilter);
      setPage(1);

      let newFilters = { ...urlParams };
      delete newFilters.start;

      if (newFilter === "date") {
        setUrlParams({
          ...newFilters,
          sort: "date"
        });
      } else {
        delete newFilters.sort;
        setUrlParams(newFilters);
      }
    },
    [urlParams]
  );

  const handleSourceFilterUpdate = useCallback(
    (newFilter) => {
      setSourceFilter(newFilter);
      setPage(1);

      let newFilters = { ...urlParams };
      delete newFilters.start;
      if (newFilter.text !== SOURCE_FILTER.all.text) {
        setUrlParams({
          ...newFilters,
          siteSearch: newFilter.url,
          siteSearchFilter: "i"
        });
      } else {
        delete newFilters.siteSearch;
        delete newFilters.siteSearchFilter;
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

      if (
        new URLSearchParams(urlParams).toString() !==
        window.location.search.split("?")[1]
      ) {
        setLocationQueryParams("?" + new URLSearchParams(urlParams).toString());
      }

      const newFilters = { ...urlParams };
      if (newFilters.authors) {
        if (newFilters.orTerms) {
          newFilters.orTerms =
            newFilters.orTerms.trim() + " " + newFilters.authors;
        } else {
          newFilters.orTerms = newFilters.authors;
        }
      }
      delete newFilters.authors;
      const fullParams = new URLSearchParams({
        cx: SEARCH_ENGINE.cx,
        key: SEARCH_ENGINE.key,
        ...newFilters
      });

      axios
        .get(`${SEARCH_ENGINE.url}?${fullParams.toString()}`)
        .then((response) => {
          let results = response.data.items;
          if (!results || results?.length === 0) {
            setAppState({
              isLoading: false,
              issueText: "Отсутствуют результаты по данному запросу.",
              items: results
            });
          } else {
            setAppState({
              isLoading: false,
              items: results,
              count: getPagesCount(
                response.data.searchInformation.totalResults
              )
            });
          }
        })
        .catch((error) => {
          console.log("Error: " + error);
          setAppState({
            isLoading: false,
            issueText: "Произошла ошибка, попробуйте позже.",
            items: []
          });
        });
    }
  }, [setAppState, urlParams]);

  const handleResetFilters = () => {
    setOrderFilter("relevance");
    setPeriodFilter(PERIOD_FILTER["all"]);
    setSourceFilter(SOURCE_FILTER["all"]);
    setUrlParams({});
    setLocationQueryParams("");
  };

  const handleUpdatePage = (page) => {
    setPage(Number(page));
    if (page !== 1) {
      setUrlParams({
        ...urlParams,
        start: (page - 1) * 10 + 1
      });
    } else {
      let newFilters = { ...urlParams };
      delete newFilters.start;
      setUrlParams(newFilters);
    }
  };

  const handleSearch = (searchValue) => {
    if (searchValue.trim()) {
      let newFilters = { ...urlParams };
      delete newFilters.start;
      setPage(1);
      setUrlParams({
        ...newFilters,
        q: searchValue
      });
    } else {
      showErrorMessageToast("Запрос не может быть пустым");
      handleResetFilters();
      setUrlParams({});
      setLocationQueryParams("");
    }
  };

  const handleExtendedSearch = (filters) => {
    let newFilters = { ...urlParams };
    const filterKeys = [
      "hq",
      "exactTerms",
      "excludeTerms",
      "orTerms",
      "sort",
      "authors"
    ];
    filterKeys.forEach((key) => {
      delete newFilters[key];
    });
    setUrlParams({
      ...newFilters,
      ...filters
    });
  };

  const openMenu = () => {
    setMenuOpen((prevState) => !prevState);
  };

  const setLocationQueryParams = (params) => {
    history.pushState(null, null, window.location.pathname + params);
  };

  const handleOpenESDialog = () => {
    setDialogOpen(true);
    setMenuOpen(false);
  };  

  const signUp = () => {
    navigate("/sign-up");
  };

  return (
    <>
      <Header>
        <Link to="/">
          <Logo className="header-logo" />
        </Link>
        <SearchBar
          resetFilters={handleResetFilters}
          search={handleSearch}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          extendedSearch={handleExtendedSearch}
        />
        <Avatar onClick={openMenu} title="Профиль" />
        {menuOpen && (
          <NavMenu
            setMenuOpen={setMenuOpen}
            openESDialog={handleOpenESDialog}
            signUp={signUp}
          />
        )}
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
            changeFrom={(newFrom) => setFrom(newFrom)}
            changeTo={(newTo) => setTo(newTo)}
            from={from}
            to={to}
          />
          <SourceFilter
            currentFilter={sourceFilter}
            updateFilter={handleSourceFilterUpdate}
          />
        </LeftPanel>
        <Body>
          <SearchResults
            isLoading={appState.isLoading}
            issueText={appState.issueText}
            items={appState.items}
            selectedPage={page}
            updatePage={handleUpdatePage}
            count={appState.count}
          />
        </Body>
      </div>
    </>
  );
}
