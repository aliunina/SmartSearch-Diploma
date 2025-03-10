import { PERIOD_FILTER } from "../constants/index";

export const getFilterQuery = (filter) => {
  for (let entry in PERIOD_FILTER) {
    if (PERIOD_FILTER[entry].key === filter) {
      const date = getDate(PERIOD_FILTER[entry].value);
      return "+after:" + date;
    }
  };  
};

function getDate(month) {
  let date = new Date();

  if (month > date.getMonth()) {
    month = month - date.getMonth();
    date.setFullYear(date.getFullYear() - 1, 12 - month, 1);
  } else date.setMonth(date.getMonth() - month, 1);
  return date.getMonth() + 1 + " " + date.getFullYear();
}
