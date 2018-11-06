import "jest-extended";
import { WriteChapter, WriteFile } from "../file";
import { NovelBuilder } from "../../builder/novel";
import { existsSync } from "fs";

import tmp from "tmp";
import { join } from "path";
tmp.setGracefulCleanup();

const id = "1837353";

describe("Write to the file", function() {
  const tempFolder = tmp.dirSync({ template: "/tmp/nd-testing-tempA-XXXXXXX.d" });

  describe("Mock the content", function() {
    const content = "Some content in the world";

    test("Should write the content by WriteChapter ", function() {
      expect.hasAssertions();

      return WriteChapter(content, NovelBuilder.createChapter(id, "4", { location: tempFolder.name }), false).then(
        c => {
          expect(c.id).toEqual("1837353");
          expect(existsSync(c.file())).toBeTrue();
        }
      );
    });

    test("Should write the content by WriteFile", function() {
      expect.hasAssertions();

      return WriteFile(content, join(tempFolder.name, "temp.file"), false)
        .then(v => {
          expect(v).not.toBeEmpty();
        })
        .catch(e => {
          fail(e);
        });
    });

    test("Shouldn't write the content to no permission", function() {
      expect.hasAssertions();

      return expect(WriteFile(content, "/usr/some.file", false)).toReject();
    });

    test("Shouldn't write if file exist", function() {
      expect.hasAssertions();

      const file = tmp.fileSync({ template: "/tmp/nd-testing-tempB-XXXXXXX.f" });
      return expect(WriteFile(content, file.name, false)).toReject();
    });
  });
});
