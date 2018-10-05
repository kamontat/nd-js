import { Novel } from "./Novel";
import { WriteFile } from "../apis/file";
import { join, dirname } from "path";
import { DEFAULT_RESOURCE_NAME } from "../constants/novel.const";
import { mkdirpSync } from "fs-extra";
import { PROJECT_NAME, VERSION } from "../constants/nd.const";
import { Timestamp } from "../helpers/helper";

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
        date: Timestamp(this.novel._downloadAt)
      },
      novel: {
        id: this.novel._id,
        name: this.novel._name,
        lastUpdate: this.novel._updateAt,
        chapters:
          (this.novel._chapters &&
            this.novel._chapters.map(chap => ({
              name: chap._name,
              number: chap._chapterNumber,
              date: Timestamp(chap._date),
              status: chap.status
            }))) ||
          []
      }
    };
  }

  /**
   * Save the result to resource file
   */
  save(force?: boolean) {
    const location = this.novel._location || "";
    const path = join(location, DEFAULT_RESOURCE_NAME);
    mkdirpSync(dirname(path));
    return WriteFile(JSON.stringify(this.buildJSON(), undefined, "  "), path, force);
  }

  static Load(location: string): Resource {
    // FIXME: json file not load
    const path = join(location, DEFAULT_RESOURCE_NAME);
    const json = require(path);

    console.log(json);

    // mock
    const novel = new Novel("12");
    return new Resource(novel);
  }
}
