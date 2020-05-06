export const questionTypes = [
  "FREE_RESPONSE",
  "SELECT_ONE",
  "SELECT_ONE_WRITE_OTHER",
  "SELECT_MULTIPLE",
  "SELECT_MULTIPLE_WRITE_OTHER",
  "DROP_DOWN",
  "SLIDER",
  "LABELED_SLIDER",
  "INSTRUCTIONS",
  "GEO_LOCATION",
  "DATE",
  "TIME",
  "MONTH_AND_YEAR",
  "YEAR",
  "RATING",
  "LIST_OF_TEXT_BOXES",
  "LIST_OF_INTEGER_BOXES",
  "INTEGER",
  "DECIMAL_NUMBER",
  "RANGE",
  "PHONE_NUMBER",
  "ADDRESS",
  "EMAIL_ADDRESS"
];

export const questionTypesWithOptions = [
  "SELECT_ONE",
  "SELECT_MULTIPLE",
  "SELECT_ONE_WRITE_OTHER",
  "SELECT_MULTIPLE_WRITE_OTHER",
  "LIST_OF_TEXT_BOXES",
  "LIST_OF_INTEGER_BOXES",
  "LABELED_SLIDER",
  "DROP_DOWN"
];

export const languages = [
  { name: "English", code: "en" },
  { name: "Amharic", code: "am" },
  { name: "Arabic", code: "ar" },
  { name: "Khmer", code: "km" },
  { name: "Spanish", code: "es" },
  { name: "Swahili", code: "sw" },
  { name: "Telugu", code: "te" },
  { name: "Chinese", code: "zh" }
];

export const modalWidth = window.innerWidth * 0.8;

export const pdfResponseHeights = [50, 100, 150, 200];

export const questionTypesWithDefaultResponses = [
  "FREE_RESPONSE",
  "INTEGER",
  "DECIMAL_NUMBER"
];

export const ALL = "ALL";
export const ANY = "ANY";
export const ANY_AND_NO_OTHER = "ANY_AND_NO_OTHER";
export const ANY_NOT_SELECTED = "ANY_NOT_SELECTED";

export const skipOperationTypes = [
  ANY,
  ALL,
  ANY_AND_NO_OTHER,
  ANY_NOT_SELECTED
];

export const valueOperators = [
  "EQUALS_TO",
  "LESS_THAN",
  "EQUALS_TO_OR_LESS_THAN",
  "NOT_EQUALS_TO",
  "MORE_THAN",
  "EQUALS_TO_OR_MORE_THAN"
];

export const scoreTypes = [
  "MATCH",
  "SUM",
  "CALCULATION",
  "AVERAGE",
  "LOWEST",
  "HIGHEST"
];

export const institutionTypes = ["RESIDENTIAL", "NON_RESIDENTIAL"];
