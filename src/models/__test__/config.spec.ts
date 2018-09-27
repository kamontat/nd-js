import "jest-extended";
import setting from "../Logger";
import Config from "../Config";
import { major } from "semver";
import { VERSION } from "../../constants/nd.const";
import { homedir } from "os";
import { config } from "winston";

test("Should have default value in config", function() {
  const config = new Config("/tmp", { quiet: true });

  let token = config.getToken();
  expect(token).toBeEmpty();

  let username = config.getUserId();
  expect(username).toBeEmpty();

  expect(config.getVersion()).toEqual(major(VERSION));

  expect(config.getNovelLocation()).toEqual(homedir());
});

test("Should load the config from file", function() {
  const config = Config.Load();
  expect(config.getToken()).not.toBeEmpty();

  expect(config.getUserId()).not.toBeEmpty();

  // valid will return error
  expect(config.valid()).toBeUndefined();
});

test("Should able to set the value of config", function() {
  const config = Config.Load();

  config.setColor("false");
  expect(config.getColor()).toEqual(false);

  config.setToken("ABGT");
  expect(config.getToken()).toEqual("ABGT");

  config.setToken("ZTRAD");
  expect(config.getToken()).toEqual("ZTRAD");
});
