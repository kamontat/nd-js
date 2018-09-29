import "jest-extended";
import { Exception, EError, NFError, FError, Warning } from "../Exception";
import { setProperty } from "../../../test/test";

test("Should able to create new Exception class", function() {
  const exception = new Exception("Test error");

  expect(exception.warn).toBeFalse();
  expect(exception.code).toEqual(1);
  expect(exception.message).toInclude("Test error");
});

test("Should able to create NFError class", function() {
  const exception = new NFError("something");
  expect(exception.code).toEqual(10);

  const shiftException = new NFError("something 2", 2);
  expect(shiftException.code).toEqual(12);
});

test("Should able to create EError class", function() {
  const exception = new EError("something");
  expect(exception.code).toEqual(30);

  const shiftException = new EError("something 2", 2);
  expect(shiftException.code).toEqual(32);
});

test("Should able to create FError class", function() {
  const exception = new FError("something");
  expect(exception.code).toEqual(50);

  const shiftException = new FError("something 2", 12);
  expect(shiftException.code).toEqual(62);
});

test("Should create warning exception", function() {
  const warn = new Warning("Warning", 2);
  expect(warn.warn).toBeTrue();
});

test("Should able to load load cause", function() {
  const exception = new EError("Some of string");

  exception.loadString("Hello world");

  expect(exception.message).toInclude("Hello world");
});

test("Should clone and return new object", function() {
  const e1 = new EError("Error 1");
  e1.loadString("Load description");

  const e2 = e1.clone();

  expect(e1.message).toEqual(e2.message);
  expect(e1.code).toEqual(e2.code);
  expect(e1.description).toEqual(e2.description);
  expect(e1.name).toEqual(e2.name);

  expect(e1 === e2).toBeFalse();
});

test("Should clone to their own object", function() {
  const e1 = new NFError("not found");
  const e2 = new FError("failed");

  const e3 = e2.clone();
  e3.loadError(new Error("Add new error"));

  const e4 = new Warning("warning");

  expect(e1.clone().code).toEqual(10);

  expect(e2.message).not.toEqual(e3.message);

  expect(e3.message).toInclude("Add new error");

  expect(e4.clone().warn).toBeTrue();
});

test("Shouldn't clone Exception class", function() {
  const e1 = new Exception("Class");
  const e2 = e1.clone();

  e2.loadString("Add new string");

  // this cause by clone the ref, not value
  expect(e1.message).toEqual(e2.message);
});

test("Shouldn't exit in warning exception", function() {
  const e = new Warning("warning");
  e.printAndExit();
});

test("Should exit when error are occurred", function() {
  const mockExit = jest.fn();
  setProperty(process, "exit", mockExit);

  const e = new EError("Error");
  e.printAndExit();

  expect(mockExit).toHaveBeenCalledWith(30);
});
