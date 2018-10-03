require("jest-extended");

const winston = require("winston");
const setting = require("../src/models/Logger").default;

process.env.NODE_CONFIG_ENV = "development";
process.env.NODE_CONFIG_STRICT_MODE = false;

winston.configure(setting({ quiet: true, log: { has: false, folder: "" } }));
