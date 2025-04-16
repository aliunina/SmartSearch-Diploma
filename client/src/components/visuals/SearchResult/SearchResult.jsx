import "./SearchResult.css";

import Button from "../../inputs/Button/Button";

import { DeleteFilled, StarFilled } from "@ant-design/icons";

export default function SearchResult({
  link,
  displayLink,
  title,
  snippet,
  hideDeleteButton,
  hideSaveButton,
  saveArticle,
  deleteArticle
}) {
  return (
    <div className="search-result-container">
      <a className="search-result-title" target="_blank" href={link}>
        {title}
      </a>
      <a className="search-result-site" target="_blank" href={link}>
        {displayLink}
      </a>
      <p className="search-result-snippet">{snippet}</p>
      <Button
        onClick={saveArticle}
        hidden={hideSaveButton}
        className="search-result-save-button"
      >
        <StarFilled />
        Сохранить
      </Button>
      <Button
        onClick={deleteArticle}
        hidden={hideDeleteButton}
        className="search-result-delete-button"
      >
        <DeleteFilled />
        Удалить
      </Button>
    </div>
  );
}
