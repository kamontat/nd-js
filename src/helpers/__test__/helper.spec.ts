import "jest-extended";
import { CheckIsExist, CheckIsNumber } from "../helper";

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
