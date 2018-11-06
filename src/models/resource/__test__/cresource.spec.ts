import "jest-extended";

import { CommandResource } from "../CommandResource";
import { major } from "semver";
import { ND } from "../../../constants/nd.const";

describe("Create command resource", function() {
  const cres = new CommandResource();

  test("Should contain command version", function() {
    expect(cres.build().version).toInclude(major(ND.VERSION).toString());
  });

  test("Should contain command name", function() {
    expect(cres.build().name).toInclude(ND.PROJECT_NAME);
  });

  test("Should contain command date", function() {
    expect(cres.build().date).not.toBeEmpty();
  });
});
