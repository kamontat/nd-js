import "jest-extended";
import { MakeReadableNumberArray } from "../helper";

const TestHelper_ReadableArray = (array: Array<any>, result: string) => {
  const readable = MakeReadableNumberArray(array);
  expect(readable).toEqual(result);
};

type TestCase = {
  title: string;
  list: Array<any>;
  result: string;
};

const testcases: TestCase[] = [
  {
    title: "Should replace array of string with dash",
    list: ["1", "2", "3", "4", "5"],
    result: "1-5"
  },
  {
    title: "Should replace array of number with dash",
    list: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    result: "4-14"
  },
  {
    title: "Should show as normal array if not continue number array pass",
    list: [12, 51, 77, 79, 81, 100],
    result: "12, 51, 77, 79, 81, 100"
  },
  {
    title: "Should show as normal array if not continue string array pass",
    list: ["41", "45", "47", "49"],
    result: "41, 45, 47, 49"
  },
  {
    title: "Should show normal array if non number pass 1",
    list: ["12", "31", "ASDF", 51],
    result: "12,31,ASDF,51"
  },
  {
    title: "Should show normal array if non number pass 2",
    list: ["ASDF", "2", 3, "4", 51],
    result: "ASDF,2,3,4,51"
  },
  {
    title: "Should combine case; first range, second normal",
    list: [23, 24, 25, "30", "35", "38"],
    result: "23-25, 30, 35, 38"
  },
  {
    title: "Should combine case; 2 range number",
    list: ["30", 31, 32, "35", 36, "37", "38"],
    result: "30-32, 35-38"
  },
  {
    title: "Should combine case; first normal, second range",
    list: ["102", "105", "200", "240", 312, 313, 314, "315", "316"],
    result: "102, 105, 200, 240, 312-316"
  },
  {
    title: "Should combine case; advance mode",
    list: [
      "1",
      2,
      "3",
      "4",
      "6",
      "7",
      8,
      9,
      "11",
      13,
      14,
      16,
      "19",
      20,
      "21",
      "24",
      "30",
      31,
      32,
      33,
      34,
      "36",
      "37",
      38,
      39,
      "41"
    ],
    result: "1-4, 6-9, 11, 13-14, 16, 19-21, 24, 30-34, 36-39, 41"
  }
];

testcases.forEach(testcase =>
  test(testcase.title, function() {
    TestHelper_ReadableArray(testcase.list, testcase.result);
  })
);
