/**
 * @external
 * @module helper
 */

export const CheckIsExist = (value: string | undefined | null) => {
  return value !== undefined && value !== null && value !== "" && value !== "null" && value !== "undefined";
};

export const CheckIsNumber = (v: string) => {
  return v.match(/^\d+$/) !== null;
};

export const MakeReadableNumberArray = (array: Array<string>) => {
  let result = array[0];

  // should already sorted
  let cont = false;
  let dash = false;
  for (let i = 0; i < array.length; i++) {
    const current = parseInt(array[i]);
    if (isNaN(current)) return array.toString();
    if (i + 1 < array.length) {
      const next = parseInt(array[i + 1]);
      cont = current + 1 == next;
      if (cont && !dash) {
        result += "-";
        dash = true;
        continue;
      } else if (!cont) {
        if (dash) {
          result += array[i];
          dash = false;
        }
        result += `, ${next}`;
        cont = false;
        continue;
      }
    } else {
      if (cont) {
        result += current;
      }
    }
  }

  return result;
};
