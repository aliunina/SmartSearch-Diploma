export const getFilterQuery = (filter) => {
  let res;
};

function getDate(month) {
  let date = new Date();

  if (month > date.getMonth()) {
    month = month - date.getMonth();
    date.setFullYear(date.getFullYear() - 1, 12 - month, 1);
  } else date.setMonth(date.getMonth() - month, 1);
  return date.getMonth() + 1 + " " + date.getFullYear();
}
