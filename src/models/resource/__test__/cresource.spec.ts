import "jest-extended";

import { CommandResource } from "../CommandResource";
import { major } from "semver";
import { ND } from "../../../constants/nd.const";

describe("Create command resource", function() {
  const cres = new CommandResource();

  test("Should contain command version", function() {
    expect(cres.toJSON().version).toInclude(major(ND.VERSION).toString());
  });

  test("Should contain command name", function() {
    expect(cres.toJSON().name).toInclude(ND.PROJECT_NAME);
  });

  test("Should contain command date", function() {
    expect(cres.toJSON().date).not.toBeEmpty();
  });
});
