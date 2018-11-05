/**
 * @internal
 * @module nd.resource
 */

import { Novel } from "../novel/Novel";

export interface NovelChapterResourceType {
  name: string | undefined;
  number: string;
  date: string | undefined;
  status: string;
}

export interface NovelResourceType {
  id: string;
  name: string | undefined;
  lastUpdate: string | undefined;
  chapters: NovelChapterResourceType[];
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
        chapters: [],
      };

    return this.novel.toJSON();
  }
}
