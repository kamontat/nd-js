/**
 * @internal
 * @module nd.builder
 * @description Novel object builder and chapter builder
 */

import { FetchApi } from "../apis/download";
import { Novel } from "../models/Novel";
import { NovelChapter, NovelZeroChapter } from "../models/Chapter";
import { GetNID } from "../helpers/novel";
import { Moment } from "moment";
import { Resource } from "../models/Resource";
import Config from "../models/Config";

type NovelChapterBuilderOption = { name?: string; location?: string; date?: Moment };

export class NovelBuilder {
  static fetch(id: string, option?: { location?: string }) {
    return FetchApi(NovelBuilder.createChapter(id, undefined, { location: option && option.location }));
  }

  static build(id: string, $: CheerioStatic, option?: { location?: string }) {
    const novel = new Novel(id, (option && option.location) || Config.Load().getNovelLocation());
    return novel.load($);
  }

  static buildLocal(_: string) {
    // TODO: implement is resource loading by location path
  }

  static createChapter(id: string, chapter?: string, option?: NovelChapterBuilderOption) {
    return new NovelChapter(id, chapter, option && option.name, option && option.location, option && option.date);
  }

  static createZeroChapter(novel: Novel) {
    return new NovelZeroChapter(novel);
  }

  static createChapterByLink(url: URL, option?: NovelChapterBuilderOption) {
    return new NovelChapter(
      GetNID(url.toString()),
      url.searchParams.get("chapter") || undefined,
      option && option.name,
      option && option.location,
      option && option.date
    );
  }
}
