export const CheckIsExist = (value: string) => {
  return value !== undefined && value !== null && value !== "" && value !== "null" && value !== "undefined";
};
