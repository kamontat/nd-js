import "jest-extended";
import Config from "../Config";
import { major } from "semver";
import { ND } from "../../../constants/nd.const";
import { homedir } from "os";

import { TEST_NAME, TEST_TOKEN } from "../../../../test/test";

test("Should have default value in config", function() {
  const config = new Config("/tmp/path/to/not-exist", { quiet: true });

  let token = config.getToken();
  expect(token).toBeEmpty();

  let username = config.getFullname();

  expect(username).toBeEmpty();
  expect(config.getVersion()).toEqual(major(ND.VERSION));
  expect(config.getNovelLocation()).toEqual(homedir());
});

test("Should initial config file", function() {
  try {
    Config.Initial();
  } catch (e) {
    expect(e.message).toInclude("exist");
  }
});

test("Should load the config from file", function() {
  const config = Config.Initial(true);

  // valid will return error
  expect(config.valid()).toBeUndefined();
});

test("Should able to set the value of config", function() {
  const config = Config.Load({ bypass: true });

  config.setColor("false");
  expect(config.getColor()).toEqual(false);

  config.setToken("ABGT");
  expect(config.getToken()).toEqual("ABGT");

  config.setToken("ZTRAD");
  expect(config.getToken()).toEqual("ZTRAD");

  config.setOutputType("long");
  expect(config.getOutputType()).toEqual("long");

  config.setOutputType("short");
  expect(config.getOutputType()).toEqual("short");

  config.setVersion("4.2.1");
  expect(config.getVersion()).toEqual(4);
});

test("Should able to update config by command options", function() {
  const config = Config.Load();

  config.updateByOption({ location: "/tmp/newlocation" });
  expect(config.getNovelLocation()).toEqual("/tmp/newlocation");
});

test("Should set the valid token to file", function() {
  const config = Config.Load({ bypass: true, quiet: true, force: true });
  config.setToken(TEST_TOKEN);
  config.setFullname(TEST_NAME);
  config.save();

  expect(config.getToken()).toEqual(TEST_TOKEN);
});
