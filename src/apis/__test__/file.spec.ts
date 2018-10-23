import "jest-extended";
import { WriteChapter } from "../file";
import { NovelBuilder } from "../../builder/novel";
import { existsSync } from "fs";

import tmp from "tmp";
tmp.setGracefulCleanup();

const id = "1837353";

test("Should write content to file", function() {
  const temp = tmp.dirSync({ template: "/tmp/nd-testing-caches-XXXXXXX.d" });

  expect.hasAssertions();
  return WriteChapter("Content", NovelBuilder.createChapter(id, "4", { location: temp.name }), false).then(c => {
    expect(c.id).toEqual("1837353");
    expect(existsSync(c.file())).toBeTrue();
  });
});
