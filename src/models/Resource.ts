/**
 * @internal
 * @module nd.resource
 */

import { Novel } from "./Novel";
import { WriteFile } from "../apis/file";
import { join, dirname } from "path";
import { DEFAULT_RESOURCE_NAME } from "../constants/novel.const";
import { mkdirpSync, readFileSync } from "fs-extra";
import { ND } from "../constants/nd.const";
import { Timestamp } from "../helpers/helper";
import { NOVEL_NOTFOUND_ERR } from "../constants/error.const";
import { ResourceObjectType } from "./ResourceType";
import { CommandResource } from "./CommandResource";
import { NovelResource } from "./NovelResource";

export class Resource {
  // TODO: Add change history
  // command: CommandResource;
  // novel: NovelResource;
  // novel: Novel;

  constructor(_: { location?: string; novel?: Novel } = {}) {
    // if (option.novel) this.novel = new NovelResource(option.novel);
    // else this.novel = NovelResource.build(location);
    // this.command = new CommandResource({lastUpdate: this.novel.novel._updateAt});
  }

  buildJSON() {
    return {};
  }

  /**
   * Save the result to resource file
   */
  // save(force?: boolean) {
  //   const location = this.novel._location || "";
  //   const path = join(location, DEFAULT_RESOURCE_NAME);
  //   mkdirpSync(dirname(path));
  //   return WriteFile(JSON.stringify(this.buildJSON(), undefined, "  "), path, force);
  // }

  // static Load(location: string): Resource {
  //   // FIXME: json file not load
  //   const path = join(location, DEFAULT_RESOURCE_NAME);
  //   try {
  //     const buffer = readFileSync(path);
  //     const json: ResourceObjectType = JSON.parse(buffer.toString());

  //     console.log(json.command);

  //     // mock
  //     const novel = new Novel("12");
  //     return new Resource(novel);
  //   } catch (e) {
  //     throw NOVEL_NOTFOUND_ERR.clone().loadString(`Resource file not exist. at ${path}`);
  //   }
  // }
}
