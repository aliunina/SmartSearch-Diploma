import { toast, Zoom } from "react-toastify";
import { SOURCE_FILTER } from "../constants";

export const getPagesCount = (totalResults) => {
  if (totalResults > 100) return 10;
  return Math.ceil(totalResults / 10);
};

export const getFormmattedDate = (date) => {
  const dateObj = new Date(date);
  return `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${dateObj.getDate().toString().padStart(2, "0")}`;
};

export const showErrorMessageToast = (message) => {
  toast.error(message, {
    toastId: "error",
    position: "bottom-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "light",
    transition: Zoom,
    className: "message-toast"
  });
};
