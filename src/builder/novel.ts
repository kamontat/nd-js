/**
 * @internal
 * @module nd.novel.builder
 */

import { Moment } from "moment";

import { FetchApi } from "../apis/download";
import { GetNID } from "../helpers/novel";
import { NovelChapter, NovelZeroChapter } from "../models/Chapter";
import Config from "../models/Config";
import { Novel } from "../models/Novel";
import { Resource } from "../models/Resource";

interface NovelChapterBuilderOption {
  name?: string;
  location?: string;
  date?: Moment;
}

export class NovelBuilder {
  public static fetch(id: string, option?: { location?: string }) {
    return FetchApi(NovelBuilder.createChapter(id, undefined, { location: option && option.location }));
  }

  public static build(id: string, $: CheerioStatic, option?: { location?: string }) {
    const novel = new Novel(id, (option && option.location) || Config.Load().getNovelLocation());
    return novel.load($);
  }

  public static buildLocal(_: string) {
    // TODO: implement is resource loading by location path
  }

  public static createChapter(id: string, chapter?: string, option?: NovelChapterBuilderOption) {
    return new NovelChapter(id, chapter, option && option.name, option && option.location, option && option.date);
  }

  public static createZeroChapter(novel: Novel) {
    return new NovelZeroChapter(novel);
  }

  public static createChapterByLink(url: URL, option?: NovelChapterBuilderOption) {
    return new NovelChapter(
      GetNID(url.toString()),
      url.searchParams.get("chapter") || undefined,
      option && option.name,
      option && option.location,
      option && option.date,
    );
  }
}
