/**
 * @internal
 * @module nd.resource
 */

import { readFile, readJSONSync } from "fs-extra";
import { join } from "path";

import { DEFAULT_RESOURCE_NAME } from "../../constants/novel.const";
import { History } from "../history/History";
import { Novel } from "../novel/Novel";

import { CommandResource, CommandResourceType } from "./CommandResource";
import { HistoryResource, HistoryResourceType } from "./HistoryResource";
import { NovelResource, NovelResourceType } from "./NovelResource";

export interface ResourceType {
  command: CommandResourceType;
  novel: NovelResourceType;
  history: HistoryResourceType;
}

export class Resource {
  constructor() {
    this.cresource = new CommandResource();
    this.nresource = new NovelResource();
    this.hresource = new HistoryResource();
  }

  public nresource: NovelResource;
  public cresource: CommandResource;
  public hresource: HistoryResource;

  public loadNovel(novel: Novel) {
    this.nresource.load(novel);
  }

  public loadHistory(history: History) {
    this.hresource.load(history);
  }

  public loadLocation(location: string): ResourceType {
    const path = this.buildPath(location);
    return readJSONSync(path);
  }

  public buildPath(location: string) {
    return join(location, DEFAULT_RESOURCE_NAME);
  }

  public toJSON(): ResourceType {
    return {
      command: this.cresource.build(),
      novel: this.nresource.build(),
      history: this.hresource.build(),
    };
  }
}
