require("jest-extended");

process.env.NODE_CONFIG_ENV = "development";
process.env.NODE_CONFIG_STRICT_MODE = false;

const winston = require("winston");
const setting = require("../src/models/Logger").default;
const Config = require("../src/models/Config").default;

const helper = require("./test");

winston.configure(setting({ quiet: true, log: { has: false, folder: "" } }));

beforeAll(() => {
  const config = Config.Initial(true);
  config.setToken(helper.TEST_TOKEN);
  config.setUsername(helper.TEST_NAME);
  config.save();
});

afterAll(() => {
  const config = Config.Load({ bypass: true, quiet: true });
  config.setToken(helper.TEST_TOKEN);
  config.setUsername(helper.TEST_NAME);
  config.save();
});
