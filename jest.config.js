module.exports = {
  setupTestFrameworkScriptFile: "./jest.setup.js",
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverageFrom: ["**/*.ts", "!**/node_modules/**"],
  coverageReporters: ["json", "lcov", "text-summary"],
  moduleFileExtensions: ["js", "ts", "html", "mustache"],
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.mustache$": "<rootDir>/test/htmlLoader.js",
    "^.+\\.css$": "jest-raw-loader"
  },
  reporters: ["default", ["jest-junit", { output: "coverage/reporter/junit/result.xml" }]]
};
