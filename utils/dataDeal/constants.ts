export const defaultDateFormat = {
  time: "YYYY-MM-DD HH:mm:ss",
  minute: "YYYY-MM-DD HH:mm",
  hour: "YYYY-MM-DD HH:mm",
  day: "YYYY-MM-DD",
  month: "YYYY-MM",
  year: "YYYY",
};
export const dateArr = ["time", "minute", "hour", "day", "month", "year"];
export const basicDataTypeArr = [
  "imgArrToggleString",
  "stringToggleImgArr",

  "booleanToggleNumber",
  "numberToggleBoolean",

  "arrayToggleString",
  "stringToggleArray",
];
export const objectDataTypeArr = ["jsonString", "jsonParse"];
export const dataTypeArr = [...basicDataTypeArr, ...objectDataTypeArr];

export const dealFuncType = {
  afterRequest: "afterRequest",
  beforeSubmit: "beforeSubmit",
};
