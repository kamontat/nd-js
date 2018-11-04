/**
 * @internal
 * @module nd.resource
 */

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
  // TODO: implement build resource object from path
  // public static Build(location: string) {
  //   return new Novel();
  // }

  public nresource: NovelResource;
  public cresource: CommandResource;
  public hresource: HistoryResource;

  public loadNovel(novel: Novel) {
    this.nresource.load(novel);
  }

  public loadHistory(history: History) {
    this.hresource.load(history);
  }

  public toJSON(): ResourceType {
    return {
      command: this.cresource.build(),
      novel: this.nresource.build(),
      history: this.hresource.build(),
    };
  }
}
