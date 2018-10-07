/**
 * @internal
 * @module nd.resource
 */

import { Novel } from "./Novel";
import { Timestamp } from "../helpers/helper";

export type NovelResourceType = {
  id: string;
  name: string | undefined;
  lastUpdate: string | undefined;
  chapters: { name: string | undefined; number: string; date: string | undefined; status: string }[];
};

export class NovelResource {
  private novel: Novel;

  constructor(novel: Novel) {
    this.novel = novel;
  }

  build() {
    return {
      id: this.novel._id,
      name: this.novel._name,
      lastUpdate: Timestamp(this.novel._updateAt),
      chapters:
        (this.novel._chapters &&
          this.novel._chapters.map(chap => ({
            name: chap._name,
            number: chap._chapterNumber,
            date: Timestamp(chap._date),
            status: chap.status
          }))) ||
        []
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
