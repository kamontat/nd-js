import "jest-extended";
import { CheckIsExist, CheckIsNumber, CheckIsBoolean } from "../helper";

describe("Testing CheckIsExist method", function() {
  [
    {
      value: "",
      result: false
    },
    {
      value: "undefined",
      result: false
    },
    {
      value: undefined,
      result: false
    },
    {
      value: "null",
      result: false
    },
    {
      value: null,
      result: false
    },
    {
      value: "exist",
      result: true
    },
    {
      value: "nothing",
      result: true
    }
  ].forEach(testcase => {
    test(`Should mark ${testcase.value} as ${testcase.result}`, function() {
      if (testcase.result) expect(CheckIsExist(testcase.value)).toBeTrue();
      else expect(CheckIsExist(testcase.value)).toBeFalse();
    });
  });
});

describe("Testing CheckIsNumber method", function() {
  [
    {
      value: "-11",
      result: false
    },
    {
      value: "",
      result: false
    },
    {
      value: "-",
      result: false
    },
    {
      value: "string",
      result: false
    },
    {
      value: "true",
      result: false
    },
    {
      value: "11301Z101O01",
      result: false
    },
    {
      value: "900E",
      result: false
    },
    {
      value: "A11301",
      result: false
    },
    {
      value: undefined,
      result: false
    },
    {
      value: null,
      result: false
    },
    {
      value: "1",
      result: true
    },
    {
      value: "11200",
      result: true
    },
    {
      value: "18282391938102",
      result: true
    },
    {
      value: "4919204875818756184747292838",
      result: true
    }
  ].forEach(testcase => {
    test(`Should mark ${testcase.value} as ${testcase.result}`, function() {
      if (testcase.result) expect(CheckIsNumber(testcase.value)).toBeTrue();
      else expect(CheckIsNumber(testcase.value)).toBeFalse();
    });
  });
});

describe("Testing CheckIdBoolean method", function() {
  [
    {
      value: "true",
      result: true
    },
    {
      value: true,
      result: true
    },
    {
      value: "false",
      result: true
    },
    {
      value: false,
      result: true
    },
    {
      value: undefined,
      result: false
    },
    {
      value: null,
      result: false
    },
    {
      value: "",
      result: false
    },
    {
      value: " ",
      result: false
    },
    {
      value: "truy",
      result: false
    },
    {
      value: "falsy",
      result: false
    },
    {
      value: "ABC",
      result: false
    },
    {
      value: "1",
      result: false
    },
    {
      value: 1,
      result: false
    },
    {
      value: 20,
      result: false
    },
    {
      value: "!@#",
      result: false
    }
  ].forEach(testcase => {
    test(`Should mark ${testcase.value} as ${testcase.result}`, function() {
      if (testcase.result) expect(CheckIsBoolean(testcase.value)).toBeTrue();
      else expect(CheckIsBoolean(testcase.value)).toBeFalse();
    });
  });
});
