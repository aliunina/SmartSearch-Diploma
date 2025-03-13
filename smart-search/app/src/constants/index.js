export const SEARCH_ENGINE = {
  url: "https://www.googleapis.com/customsearch/v1",
  key: "AIzaSyD2ABTD5HZhnnBfIDXSxs_66E72TQVLUr8",
  cx: "f5a24536d2c834267"
};

export const PERIOD_FILTER = {
  "all": {
    text: "За всё время",
    value: "all"
  },
  "month": {
    text: "Месяц",
    value: "m1"
  },
  "quarter": {
    text: "3 месяца",
    value: "m3"
  },
  "half-year": {
    text: "Полгода",
    value: "m6"
  },
  "year": {
    text: "Год",
    value: "y1"
  },
  "custom": {
    text: "Свой период",
    value: "custom"
  }
};

export const SOURCE_FILTER = {
  "all": {    
    text: "По всем источникам",
    url: null
  },
  "rep": {    
    text: "Репозиторий БНТУ",
    url: "rep.bntu.by"
  },
  "elcat": {
    text: "Электронный каталог",
    url: "elcat.bntu.by"
  },
  "lan": {
    text: "Лань",
    url: "e.lanbook.com"
  },
  "znanium": {
    text: "Znanium",
    url: "znanium.ru"
  },
  "ibooks": {
    text: "ibooks.ru - IT коллекция",
    url: "ibooks.ru"
  },
  "urait": {
    text: "Юрайт",
    url: "urait.ru"
  },
  "litres": {
    text: "Литрес",
    url: "litres.ru"
  },
  "gacademy": {
    text: "Google Академия",
    url: "scholar.google.ru"
  },
  "bntusmi": {
    text: "БНТУ в СМИ",
    url: "smi.bntu.by"
  }
};
