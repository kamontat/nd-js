/**
 * @internal
 * @module nd.resource
 */

import { Timestamp } from "../../helpers/helper";

import { Novel } from "../novel/Novel";

export interface NovelResourceType {
  id: string;
  name: string | undefined;
  lastUpdate: string | undefined;
  chapters: Array<{ name: string | undefined; number: string; date: string | undefined; status: string }>;
}

export class NovelResource {
  private novel?: Novel;

  constructor() {}

  public load(novel: Novel) {
    this.novel = novel;
  }

  public build(): NovelResourceType {
    if (!this.novel)
      return {
        id: "-1",
        name: undefined,
        lastUpdate: undefined,
        chapters: []
      };

    return this.novel.toJSON();
  }

  // static Load(result: NovelResourceType) {
  //   // TODO: load novel from result object
  //   return new NovelRe(result.id);
  // }

  // static Build(location: string) {
  //   return new Novel();
  // }
}
