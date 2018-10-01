import "jest-extended";

import { FormatMomentDateTime } from "../date";

test("Should format correctly date 1", function() {
  const date = FormatMomentDateTime("22 เม.ย. 61", "D MMM YY");

  expect(date.get("date")).toEqual(22);
  expect(date.get("month")).toEqual(3);
  expect(date.get("year")).toEqual(2018);
});

test("Should format correctly date 2", function() {
  const date = FormatMomentDateTime("29 ก.ย. 58 / 00:09", "D MMM YY [/] HH:mm");

  expect(date.get("date")).toEqual(29);
  expect(date.get("month")).toEqual(8);
  expect(date.get("year")).toEqual(2015);

  expect(date.get("hour")).toEqual(0);
  expect(date.get("minute")).toEqual(9);
});
