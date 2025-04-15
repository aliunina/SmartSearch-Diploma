import "./Library.css";
import { ArrowRightOutlined } from "@ant-design/icons";

import LeftPanel from "../../../layouts/SearchLayout/LeftPanel/LeftPanel";
import SearchResults from "../SearchResults/SearchResults";
import DateFilter from "../../filters/DateFilter/DateFilter";
import PeriodFilter from "../../filters/PeriodFilter/PeriodFilter";
import ConfirmDialog from "../../dialogs/ConfirmDialog/ConfirmDialog";
import Button from "../../inputs/Button/Button";

import axios from "axios";
import { UserContext } from "../../../contexts/UserContext/UserContext";
import { PERIOD_FILTER } from "../../../constants";

import {
  getFilterDate,
  getPagesCount,
  getSortFunction,
  showErrorMessageToast,
  showSuccessMessageToast
} from "../../../helpers/util";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Library() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [libraryPage, setLibraryPage] = useState(1);
  const [articles, setArticles] = useState([]);
  const [libraryFilter, setLibraryFilter] = useState(PERIOD_FILTER.all);
  const [librarySort, setLibrarySort] = useState("new");
  const [libraryState, setLibraryState] = useState({
    isLoading: false,
    items: [],
    count: 0
  });

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogState, setConfirmDialogState] = useState({
    text: "",
    title: "",
    confirmButtonType: "",
    confirmButtonText: "",
    data: {}
  });
  const [confirmDialogBusy, setConfirmDialogBusy] = useState(false);

  useEffect(() => {
    if (user !== null) {
      setLibraryState({
        items: [],
        count: 0,
        isLoading: true
      });
      const serverUrl = import.meta.env.VITE_SERVER_API_URL;
      axios
        .get(serverUrl + "/article/get-articles", {
          withCredentials: true
        })
        .then((response) => {
          if (response.status === 200 && response.data) {
            setArticles(response.data);

            const newLibraryState = {
              items: response.data.slice(0, 10),
              count: getPagesCount(response.data.length),
              isLoading: false
            };

            if (response.data.length === 0) {
              newLibraryState.issueText =
                "В вашей библиотеке ничего нет. Чтобы сохранить статью в библиотеке, нажмите кнопку.";
            }
            setLibraryState(newLibraryState);
          } else {
            setLibraryState({
              items: [],
              count: 0,
              isLoading: false,
              issueText:
                "В вашей библиотеке ничего нет. Чтобы сохранить статью в библиотеке, нажмите кнопку."
            });
          }
        })
        .catch((response) => {
          console.log(response.data);
          if (response.status === 404) {
            showErrorMessageToast(
              "Попытка обращения к несуществующему пользователю."
            );
          } else if (response.status === 401) {
            showErrorMessageToast(
              "Вы не авторизованы. Пожалуйста, выполните вход."
            );
          }

          setLibraryState({
            items: [],
            count: 0,
            isLoading: false,
            issueText: "Произошла ошибка, перезагрузите страницу."
          });
        });
    }
  }, [user, setLibraryState]);

  const handleLibraryPageUpdate = useCallback(
    (page) => {
      let items = articles.slice((page - 1) * 10, (page - 1) * 10 + 10);
      const newLibraryState = { ...libraryState };
      if (items.length === 0) {
        page -= 1;
        items = articles.slice((page - 1) * 10, (page - 1) * 10 + 10);
        newLibraryState.count = getPagesCount(articles.length);
      }
      if (items.length === 0 && page === 0) {
        newLibraryState.issueText = "Отсутствуют статьи в библиотеке.";
      }
      newLibraryState.items = items;
      setLibraryPage(Number(page));
      setLibraryState(newLibraryState);
    },
    [articles, libraryState]
  );

  const handleLibraryFilterUpdate = (newFilter) => {
    setLibraryFilter(newFilter);

    const sortFunction = getSortFunction(librarySort);
    const filterDate = getFilterDate(newFilter.value);

    applyLibraryFilters(sortFunction, filterDate);
  };

  const handleLibrarySortUpdate = (newSort) => {
    setLibrarySort(newSort);

    const sortFunction = getSortFunction(newSort);
    const filterDate = getFilterDate(libraryFilter.value);

    applyLibraryFilters(sortFunction, filterDate);
  };

  const applyLibraryFilters = useCallback(
    (sortFunction, filterDate) => {
      setLibraryPage(1);

      const newLibraryState = { ...libraryState };

      newLibraryState.items = articles.sort(sortFunction);
      if (filterDate) {
        newLibraryState.items = articles.filter(
          (article) => new Date(article.createdAt) > filterDate
        );
        newLibraryState.count = getPagesCount(newLibraryState.items.length);
      } else {
        newLibraryState.items = articles;
        newLibraryState.count = getPagesCount(articles.length);
      }

      setLibraryState(newLibraryState);
    },
    [articles, libraryState]
  );

  const deleteArticle = (id) => {
    setConfirmDialogOpen(true);
    setConfirmDialogState({
      isLoading: false,
      text: "Вы действительно хотите удалить статью из библиотеки?",
      title: "Подтвердите удаление статьи",
      confirmButtonType: "delete",
      confirmButtonText: "Удалить",
      data: { id }
    });
  };

  const isArticleDeleted = useRef(false);
  useEffect(() => {
    if (isArticleDeleted.current) {
      const sortFunction = getSortFunction(librarySort);
      const filterDate = getFilterDate(libraryFilter.value);
      applyLibraryFilters(sortFunction, filterDate);
      handleLibraryPageUpdate(libraryPage);

      showSuccessMessageToast("Статья успешно удалена.");
      setConfirmDialogOpen(false);
      isArticleDeleted.current = false;
    }
  }, [
    articles,
    applyLibraryFilters,
    handleLibraryPageUpdate,
    libraryPage,
    libraryFilter.value,
    librarySort
  ]);

  const handleConfirmDialogClose = (choice, data) => {
    if (choice === "confirm") {
      setConfirmDialogBusy(true);
      const serverUrl = import.meta.env.VITE_SERVER_API_URL;
      axios
        .post(
          serverUrl + "/article/delete",
          { articleId: data.id },
          {
            withCredentials: true
          }
        )
        .then(async (response) => {
          if (response.status === 200 && response.data) {
            isArticleDeleted.current = true;
            setArticles(response.data.articles);
          } else {
            showErrorMessageToast("Произошла ошибка, попробуйте еще раз.");
          }
          setConfirmDialogBusy(false);
        })
        .catch((response) => {
          console.log(response.data);
          if (response.status === 404) {
            showErrorMessageToast(
              "Попытка редактирования несуществующего пользователя или статьи."
            );
          } else if (response.status === 401) {
            showErrorMessageToast(
              "Вы не авторизованы. Пожалуйста, выполните вход."
            );
          } else {
            showErrorMessageToast("Произошла ошибка, попробуйте еще раз.");
          }
          setConfirmDialogBusy(false);
        });
    } else {
      setConfirmDialogOpen(false);
    }
  };

  const navToSearch = () => {
    navigate("/");
  };

  if (articles.length === 0) {
    return (
      <div className="empty-container">
        <img
          src="no_search_results.svg"
          className="empty-image"
          alt="Нет результатов"
        />
        <p className="empty-text">
          В вашей библиотеке ничего нет. Выполните поиск, чтобы добавить новые
          статьи в библиотеку.
        </p>
        <Button
          className="transparent-button library-search-button"
          onClick={navToSearch}
        >
          Искать <ArrowRightOutlined />
        </Button>
      </div>
    );
  }

  return (
    <div className="library">
      {confirmDialogOpen && (
        <ConfirmDialog
          dialogBusy={confirmDialogBusy}
          dialogOpen={confirmDialogOpen}
          setDialogOpen={setConfirmDialogOpen}
          dialogClose={handleConfirmDialogClose}
          text={confirmDialogState.text}
          title={confirmDialogState.title}
          confirmButtonText={confirmDialogState.confirmButtonText}
          confirmButtonType={confirmDialogState.confirmButtonType}
          data={confirmDialogState.data}
        />
      )}
      <LeftPanel>
        <DateFilter
          currentFilter={librarySort}
          updateFilter={handleLibrarySortUpdate}
        />
        <PeriodFilter
          title="Добавлено"
          currentFilter={libraryFilter}
          updateFilter={handleLibraryFilterUpdate}
          showCustomPeriod={false}
        />
      </LeftPanel>
      <SearchResults
        items={libraryState.items}
        hideDeleteButton={false}
        deleteArticle={deleteArticle}
        hideSaveButton={true}
        count={libraryState.count}
        isLoading={libraryState.isLoading}
        issueText={libraryState.issueText}
        selectedPage={libraryPage}
        updatePage={handleLibraryPageUpdate}
      />
    </div>
  );
}
