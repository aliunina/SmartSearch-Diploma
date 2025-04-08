import "./SearchResult.css";

import Button from "../../inputs/Button/Button";

import { StarFilled } from "@ant-design/icons";
import { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext/UserContext";

export default function SearchResult({
  link,
  displayLink,
  title,
  snippet,
  hideSaveButton,
  saveToLibrary
}) {  
  const { user } = useContext(UserContext);

  return (
    <div className="search-result-container">
      <a className="search-result-title" target="_blank" href={link}>
        {title}
      </a>
      <a className="search-result-site" target="_blank" href={link}>
        {displayLink}
      </a>
      <p className="search-result-snippet">{snippet}</p>
      <Button onClick={saveToLibrary} hidden={hideSaveButton} className="search-result-save-button">
        <StarFilled/>
        Сохранить
      </Button>
    </div>
  );
}
