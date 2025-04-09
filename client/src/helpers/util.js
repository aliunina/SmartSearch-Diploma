import { toast, Zoom } from "react-toastify";

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

export const getSortFunction = (sort) => {
  let sortFunction;
  if (sort === "new") {
    sortFunction = (a, b) => {
      if (a.createdAt > b.createdAt) {
        return -1;
      } else {
        return 1;
      }
    };
  } else {
    sortFunction = (a, b) => {
      if (a.createdAt < b.createdAt) {
        return -1;
      } else {
        return 1;
      }
    };
  }
  return sortFunction;
};

export const getFilterDate = (filter) => {
  let date = new Date();
  switch (filter) {
    case "all":
      date = null;
      break;
    case "m1":
      date.setMonth(date.getMonth() - 1);
      break;
    case "m3":
      date.setMonth(date.getMonth() - 3);
      break;
    case "m6":
      date.setMonth(date.getMonth() - 6);
      break;
    case "y1":
      date.setYear(date.getFullYear() - 1);
      break;
  }
  return date;
};

export const showSuccessMessageToast = (message) => {
  toast.success(message, {
    toastId: "success",
    position: "bottom-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "light",
    transition: Zoom,
    className: "message-toast"
  });
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

const EMAIL_REGEXP =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
export const isEmailValid = (email) => {
  return EMAIL_REGEXP.test(email);
};

const PASSWORD_REGEXP = /[0-9a-zA-Z!@#$%^&*]{8,50}/;
export const isPasswordValid = (password) => {
  return PASSWORD_REGEXP.test(password);
};

const CODE_REGEXP = /[0-9]{6}/;
export const isCodeValid = (code) => {
  return CODE_REGEXP.test(code);
};
