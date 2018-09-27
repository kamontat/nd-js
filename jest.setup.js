require("jest-extended");

const winston = require("winston");
const setting = require("./src/models/Logger").default;

winston.configure(setting({ quiet: true, log: { has: false, folder: "" } }));
