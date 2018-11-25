import "jest-extended";

import mock from "mock-fs";

import { WalkDirSync } from "../helper";

const testcases = [
  {
    folder: "/mock",
    max: 0,
    result: []
  },
  {
    folder: "/mock",
    max: 1,
    result: ["/mock/test-d-1", "/mock/test-d-2", "/mock/test-d-3"]
  },
  {
    folder: "/mock",
    max: 2,
    result: [
      "/mock/test-d-1",
      "/mock/test-d-2",
      "/mock/test-d-3",
      "/mock/test-d-1/test-d-11",
      "/mock/test-d-2/test-d-21",
      "/mock/test-d-2/test-d-22",
      "/mock/test-d-2/test-d-23",
      "/mock/test-d-2/test-d-24",
      "/mock/test-d-2/test-d-25",
      "/mock/test-d-2/test-d-26"
    ]
  },
  {
    folder: "/mock",
    max: undefined,
    result: [
      "/mock/test-d-1",
      "/mock/test-d-1/test-d-11",
      "/mock/test-d-1/test-d-11/test-d-111",
      "/mock/test-d-1/test-d-11/test-d-112",
      "/mock/test-d-1/test-d-11/test-d-112/test-d-1121",
      "/mock/test-d-2",
      "/mock/test-d-2/test-d-21",
      "/mock/test-d-2/test-d-22",
      "/mock/test-d-2/test-d-23",
      "/mock/test-d-2/test-d-23/test-d-231",
      "/mock/test-d-2/test-d-23/test-d-231/test-d-2311",
      "/mock/test-d-2/test-d-23/test-d-231/test-d-2312",
      "/mock/test-d-2/test-d-23/test-d-231/test-d-2313",
      "/mock/test-d-2/test-d-23/test-d-231/test-d-2314",
      "/mock/test-d-2/test-d-23/test-d-231/test-d-2315",
      "/mock/test-d-2/test-d-23/test-d-232",
      "/mock/test-d-2/test-d-23/test-d-233",
      "/mock/test-d-2/test-d-24",
      "/mock/test-d-2/test-d-25",
      "/mock/test-d-2/test-d-26",
      "/mock/test-d-3"
    ]
  }
];

describe("Make test about walk method", function() {
  beforeEach(function() {
    mock({
      "/mock": {
        "test-d-1": {
          "test-d-11": {
            "test-d-111": {
              "test-f-1111": ""
            },
            "test-d-112": {
              "test-d-1121": {},
              "test-f-1121": ""
            },
            "test-f-111": "",
            "test-f-112": ""
          },
          "test-f-11": "",
          "test-f-12": "",
          "test-f-13": ""
        },
        "test-d-2": {
          "test-d-21": {},
          "test-d-22": {},
          "test-d-23": {
            "test-d-231": {
              "test-d-2311": {},
              "test-d-2312": {},
              "test-d-2313": {},
              "test-d-2314": {},
              "test-d-2315": {}
            },
            "test-d-232": {},
            "test-d-233": {}
          },
          "test-d-24": {
            "test-f-241": "",
            "test-f-242": "",
            "test-f-243": ""
          },
          "test-d-25": {},
          "test-d-26": {},
          "test-f-21": "",
          "test-f-22": "",
          "test-f-23": ""
        },
        "test-d-3": {
          "test-f-31": "",
          "test-f-32": "",
          "test-f-33": ""
        }
      }
    });
  });

  testcases.forEach(testcase => {
    test(`Walk through ${testcase.folder}, should have ${testcase.result.length} length (when search ${
      testcase.max
    } times)`, function() {
      const result = WalkDirSync(testcase.folder, testcase.max);
      expect(result).toBeArrayOfSize(testcase.result.length);
      expect(result).toIncludeAllMembers(testcase.result);
    });
  });

  afterEach(mock.restore);
});
