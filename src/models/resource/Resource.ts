/**
 * @internal
 * @module nd.resource
 */

import { Novel } from "../novel/Novel";
import { NovelResource, NovelResourceType } from "./NovelResource";
import { CommandResource, CommandResourceType } from "./CommandResource";
import { HistoryResource, HistoryResourceType } from "./HistoryResource";
import { History } from "../history/History";

export type ResourceType = {
  command: CommandResourceType;
  novel: NovelResourceType;
  history: HistoryResourceType;
};

export class Resource {
  // TODO: implement build resource object from path
  // public static Build(location: string) {
  //   return new Novel();
  // }

  nresource: NovelResource;
  cresource: CommandResource;
  hresource: HistoryResource;

  constructor() {
    this.cresource = new CommandResource();
    this.nresource = new NovelResource();
    this.hresource = new HistoryResource();
  }

  loadNovel(novel: Novel) {
    this.nresource.load(novel);
  }

  loadHistory(history: History) {
    this.hresource.load(history);
  }

  public toJSON(): ResourceType {
    return {
      command: this.cresource.build(),
      novel: this.nresource.build(),
      history: this.hresource.build()
    };
  }
}
