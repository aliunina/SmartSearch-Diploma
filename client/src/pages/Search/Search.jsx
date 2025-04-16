import "./Search.css";
import Header from "../../layouts/SearchLayout/Header/Header";
import LeftPanel from "../../layouts/SearchLayout/LeftPanel/LeftPanel";
import Body from "../../layouts/SearchLayout/Body/Body";

import SearchResults from "../../components/visuals/SearchResults/SearchResults";
import SearchBar from "../../components/inputs/SearchBar/SearchBar";
import Logo from "../../components/visuals/Logo/Logo";
import NavMenu from "../../components/menus/NavMenu/NavMenu";
import Avatar from "../../components/visuals/Avatar/Avatar";
import PeriodFilter from "../../components/filters/PeriodFilter/PeriodFilter";
import OrderFilter from "../../components/filters/OrderFilter/OrderFilter";
import SourceFilter from "../../components/filters/SourceFilter/SourceFilter";
import Button from "../../components/inputs/Button/Button";
import BusyIndicator from "../../components/visuals/BusyIndicator/BusyIndicator";

import { PERIOD_FILTER, SOURCE_FILTER } from "../../constants/index";

import {
  getPagesCount,
  showErrorMessageToast,
  showSuccessMessageToast
} from "../../helpers/util";

import { useState, useCallback, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { UserContext } from "../../contexts/UserContext/UserContext";

export default function Search() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [urlParams, setUrlParams] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [busy, setBusy] = useState(false);

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

      const engineUrl = import.meta.env.VITE_SEARCH_ENGINE_URL;
      const cx = import.meta.env.VITE_SEARCH_ENGINE_CX;
      const key = import.meta.env.VITE_SEARCH_ENGINE_KEY;
      const fullParams = new URLSearchParams({
        cx,
        key,
        ...newFilters
      });

      axios
        .get(`${engineUrl}?${fullParams.toString()}`)
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
        .catch((response) => {
          console.log("Error: " + response);
          if (response.status === 429) {
            setAppState({
              isLoading: false,
              issueText: "Лимит запросов в системе превышен.",
              items: []
            });
          } else {
            setAppState({
              isLoading: false,
              issueText: "Произошла ошибка, попробуйте позже.",
              items: []
            });
          }
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

  const signIn = () => {
    navigate("/sign-in", {
      state: {
        navBack: true
      }
    });
  };

  const signUp = () => {
    navigate("/sign-up");
  };

  const openUserProfile = (tab = 0) => {
    navigate("/my-profile", {
      state: {
        tab
      }
    });
  };

  const signOut = () => {
    setBusy(true);
    const serverUrl = import.meta.env.VITE_SERVER_API_URL;
    axios
      .get(serverUrl + "/user/sign-out", {
        withCredentials: true
      })
      .then((response) => {
        if (response.status === 200) {
          setUser(null);
          showSuccessMessageToast("Вы вышли из аккаунта.");
        } else {
          showErrorMessageToast("Произошла ошибка, попробуйте еще раз.");
        }
        setMenuOpen(false);
        setBusy(false);
      })
      .catch((response) => {
        console.log(response.data);
        if (response.status === 404) {
          showErrorMessageToast(
            "Попытка редактирования статей несуществующего пользователя."
          );
        } else if (response.status === 401) {
          showErrorMessageToast(
            "Вы не авторизованы. Пожалуйста, выполните вход."
          );
        } else {
          showErrorMessageToast("Произошла ошибка, попробуйте позже.");
        }
        setMenuOpen(false);
        setBusy(false);
      });
  };

  const saveArticle = (article) => {
    setBusy(true);
    const serverUrl = import.meta.env.VITE_SERVER_API_URL;
    axios
      .post(serverUrl + "/article/save", article, {
        withCredentials: true
      })
      .then((response) => {
        if (response.status === 200) {
          showSuccessMessageToast(
            "Статья успешно сохранена в вашей библиотеке."
          );
        } else {
          showErrorMessageToast("Произошла ошибка, попробуйте еще раз.");
        }
        setBusy(false);
      })
      .catch((response) => {
        console.log(response.data);
        if (response.status === 404) {
          showErrorMessageToast(
            "Попытка обращения к несуществующему пользователю или статье."
          );
        } else if (response.status === 401) {
          showErrorMessageToast(
            "Вы не авторизованы. Пожалуйста, выполните вход."
          );
        } else if (response.status === 409) {
          showErrorMessageToast("Статья уже сохранена в вашей библиотеке.");
        } else if (response.status === 429) {
          showErrorMessageToast(
            "Библиотека переполнена. Пожалуйста, удалите одну из статей в библиотеке, чтобы продолжить."
          );
        } else {
          showErrorMessageToast("Произошла ошибка, попробуйте позже.");
        }
        setBusy(false);
      });
  };

  return (
    <>
      {busy && (
        <div className="darkened-background">
          <BusyIndicator />
        </div>
      )}
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
        {user && (
          <Avatar
            onClick={openMenu}
            title="Профиль"
            clickable={true}
            size={"4em"}
          />
        )}
        {!user && (
          <div className="search-header-buttons">
            <Button className="default-button" onClick={openMenu}>
              <img src="menu.svg" alt="Меню" />
            </Button>
            <Button
              className="accent-button header-sign-in-button"
              onClick={signIn}
            >
              Войти
            </Button>
          </div>
        )}
        {menuOpen && (
          <NavMenu
            setMenuOpen={setMenuOpen}
            openESDialog={handleOpenESDialog}
            signUp={signUp}
            openUserProfile={openUserProfile}
            signOut={signOut}
          />
        )}
      </Header>
      <div className="main">
        <LeftPanel className="search-left-panel">
          <OrderFilter
            currentFilter={orderFilter}
            updateFilter={handleOrderFilterUpdate}
          />
          <PeriodFilter
            title="Период"
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
          <div className="search-page-results">
            <SearchResults
              isLoading={appState.isLoading}
              issueText={appState.issueText}
              items={appState.items}
              selectedPage={page}
              updatePage={handleUpdatePage}
              hideSaveButton={!user}
              count={appState.count}
              saveArticle={saveArticle}
            />
          </div>
        </Body>
      </div>
    </>
  );
}
