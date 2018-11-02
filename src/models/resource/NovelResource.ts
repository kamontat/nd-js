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
  private novel: Novel;

  constructor(novel: Novel) {
    this.novel = novel;
  }

  public build() {
    return {
      id: this.novel.id,
      name: this.novel.name,
      lastUpdate: Timestamp(this.novel.lastUpdateAt),
      chapters: this.novel.mapChapter(chap => chap.buildJSON()),
    };
  }

  // static Load(result: NovelResourceType) {
  //   // TODO: load novel from result object
  //   return new NovelRe(result.id);
  // }

  // static Build(location: string) {
  //   return new Novel();
  // }
}
