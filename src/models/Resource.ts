import { Novel } from "./Novel";
import { WriteFile } from "../apis/file";
import { join, dirname } from "path";
import { DEFAULT_RESOURCE_NAME } from "../constants/novel.const";
import { mkdirpSync } from "fs-extra";
import { PROJECT_NAME, VERSION } from "../constants/nd.const";

export class Resource {
  // TODO: Add change history

  novel: Novel;

  constructor(novel: Novel) {
    this.novel = novel;
  }

  buildJSON() {
    return {
      command: {
        name: PROJECT_NAME,
        version: VERSION,
        date: this.novel._downloadAt.format("X")
      },
      novel: {
        id: this.novel._id,
        name: this.novel._name,
        lateUpdate: this.novel._updateAt,
        chapters:
          (this.novel._chapters &&
            this.novel._chapters.map(chap => ({ name: chap._name, number: chap._chapterNumber, date: chap._date }))) ||
          []
      }
    };
  }

  /**
   * Load the resource file to this model
   */
  load() {
    // this.novel =
  }

  /**
   * Save the result to resource file
   */
  save(force?: boolean) {
    const location = this.novel._location || "";
    const path = join(location, DEFAULT_RESOURCE_NAME);
    mkdirpSync(dirname(path));
    WriteFile(JSON.stringify(this.buildJSON(), undefined, "  "), path, force);
  }
}
