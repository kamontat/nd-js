import "jest-extended";
import Config from "../Config";
import { major } from "semver";
import { VERSION } from "../../constants/nd.const";
import { homedir } from "os";

test("Should have default value in config", function() {
  const config = new Config("/tmp", { quiet: true });

  let token = config.getToken();
  expect(token).toBeEmpty();

  let username = config.getUsername();
  expect(username).toBeEmpty();

  expect(config.getVersion()).toEqual(major(VERSION));

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
  const config = Config.Load();

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

test("Should able to save new config", function() {
  const config = Config.Initial(true);
  config.load(true);

  expect(config.getToken()).toEqual("");
  expect(config.getUsername()).toEqual("");

  config.setToken("ABCOPQ");
  config.setUsername("KC");
  config.save();

  expect(config.valid()).toBeUndefined();
});
