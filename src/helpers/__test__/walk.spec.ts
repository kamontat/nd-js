import "jest-extended";

import mock from "mock-fs";

import { WalkDirSync } from "../helper";

const testcases = [
  {
    folder: "/tmp",
    max: 0,
    result: []
  },
  {
    folder: "/tmp/mock",
    max: 1,
    result: ["/tmp/mock/test-d-1", "/tmp/mock/test-d-2", "/tmp/mock/test-d-3"]
  },
  {
    folder: "/tmp/mock",
    max: 2,
    result: [
      "/tmp/mock/test-d-1",
      "/tmp/mock/test-d-2",
      "/tmp/mock/test-d-3",
      "/tmp/mock/test-d-1/test-d-11",
      "/tmp/mock/test-d-2/test-d-21",
      "/tmp/mock/test-d-2/test-d-22",
      "/tmp/mock/test-d-2/test-d-23",
      "/tmp/mock/test-d-2/test-d-24",
      "/tmp/mock/test-d-2/test-d-25",
      "/tmp/mock/test-d-2/test-d-26"
    ]
  },
  {
    folder: "/tmp/mock",
    max: undefined,
    result: [
      "/tmp/mock/test-d-1",
      "/tmp/mock/test-d-1/test-d-11",
      "/tmp/mock/test-d-1/test-d-11/test-d-111",
      "/tmp/mock/test-d-1/test-d-11/test-d-112",
      "/tmp/mock/test-d-1/test-d-11/test-d-112/test-d-1121",
      "/tmp/mock/test-d-2",
      "/tmp/mock/test-d-2/test-d-21",
      "/tmp/mock/test-d-2/test-d-22",
      "/tmp/mock/test-d-2/test-d-23",
      "/tmp/mock/test-d-2/test-d-23/test-d-231",
      "/tmp/mock/test-d-2/test-d-23/test-d-231/test-d-2311",
      "/tmp/mock/test-d-2/test-d-23/test-d-231/test-d-2312",
      "/tmp/mock/test-d-2/test-d-23/test-d-231/test-d-2313",
      "/tmp/mock/test-d-2/test-d-23/test-d-231/test-d-2314",
      "/tmp/mock/test-d-2/test-d-23/test-d-231/test-d-2315",
      "/tmp/mock/test-d-2/test-d-23/test-d-232",
      "/tmp/mock/test-d-2/test-d-23/test-d-233",
      "/tmp/mock/test-d-2/test-d-24",
      "/tmp/mock/test-d-2/test-d-25",
      "/tmp/mock/test-d-2/test-d-26",
      "/tmp/mock/test-d-3"
    ]
  }
];

describe("Make test about walk method", function() {
  beforeEach(function() {
    mock({
      "/tmp": {
        mock: {
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
