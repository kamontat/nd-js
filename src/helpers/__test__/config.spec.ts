import "jest-extended";
import winston, { log } from "winston";

import Config from "../../models/command/Config";
import { setProperty } from "../../../test/test";
import { BeColor } from "../../constants/default.const";
import { WrapTMC } from "../../apis/loggerWrapper";

// This must test when you already init config file
test("Should load the config", function() {
  const mockFn = jest.fn();
  setProperty(winston, "log", mockFn);

  try {
    const config = Config.Load({ quiet: true, bypass: true });
    BeColor(config.getColor());
  } catch (e) {
    log(WrapTMC("error", "Loading config", e));
  }

  expect(mockFn).not.toBeCalled();
});
