import "jest-extended";
import winston from "winston";

import { HELPER_LOAD_CONFIG } from "../config";
import { setProperty } from "../../../test/test";

// This must test when you already init config file
test("Should load the config", function() {
  const mockFn = jest.fn();
  setProperty(winston, "log", mockFn);

  HELPER_LOAD_CONFIG();

  expect(mockFn).not.toBeCalled();
});
