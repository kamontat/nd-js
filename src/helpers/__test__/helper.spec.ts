import "jest-extended";
import { CheckIsExist, CheckIsNumber, CheckIsBoolean } from "../helper";

test("Should able to check empty string as false", function() {
  expect(CheckIsExist("")).toBeFalse();
});

test("Should able to check null string as false", function() {
  expect(CheckIsExist("undefined")).toBeFalse();
});

test("Should able to check null string as false", function() {
  expect(CheckIsExist(undefined)).toBeFalse();
});

test("Should able to check null string as false", function() {
  expect(CheckIsExist(null)).toBeFalse();
});

test("Should able to check null string as false", function() {
  expect(CheckIsExist("exist")).toBeTrue();
});

test("Should check only position number", function() {
  expect(CheckIsNumber("-11")).toBeFalse();
});
test("Should check false in empty string", function() {
  expect(CheckIsNumber("")).toBeFalse();
});

test("Should check false in exist string", function() {
  expect(CheckIsNumber("string")).toBeFalse();
});

test("Should check is number string", function() {
  expect(CheckIsNumber("87182347")).toBeTrue();
});

test("Should check is exceed int string", function() {
  expect(CheckIsNumber("87182347183748970918234")).toBeTrue();
});

test("Should check is string in number is false", function() {
  expect(CheckIsNumber("8718234E7")).toBeFalse();
});

test("Should return true if true pass to CheckIsBoolean", function() {
  expect(CheckIsBoolean("true")).toBeTrue();
  expect(CheckIsBoolean(true)).toBeTrue();
});

test("Should return true if false pass to CheckIsBoolean", function() {
  expect(CheckIsBoolean("false")).toBeTrue();
  expect(CheckIsBoolean(false)).toBeTrue();
});

test("Should return false if none boolean pass to CheckIsBoolean", function() {
  expect(CheckIsBoolean(undefined)).toBeFalse();
  expect(CheckIsBoolean(null)).toBeFalse();
  expect(CheckIsBoolean("")).toBeFalse();
  expect(CheckIsBoolean("ABC")).toBeFalse();
  expect(CheckIsBoolean("1")).toBeFalse();
  expect(CheckIsBoolean(1)).toBeFalse();
  expect(CheckIsBoolean("0")).toBeFalse();
  expect(CheckIsBoolean(0)).toBeFalse();
  expect(CheckIsBoolean("123")).toBeFalse();
  expect(CheckIsBoolean("!@#")).toBeFalse();
});
