/**
 * @internal
 * @module nd.builder
 * @description Novel object builder and chapter builder
 */

import { Moment } from "moment";

import { FetchApi } from "../apis/download";
import { RevertTimestamp, Timestamp } from "../helpers/helper";
import { GetNID } from "../helpers/novel";
import Config from "../models/command/Config";
import { NovelChapter } from "../models/novel/Chapter";
import { Novel } from "../models/novel/Novel";
import { NovelStatusUtils } from "../models/novel/NovelStatus";
import { NovelZeroChapter } from "../models/novel/ZeroChapter";
import { NovelChapterResourceType } from "../models/resource/NovelResource";
import { Resource } from "../models/resource/Resource";

import { ResourceBuilder } from "./resource";

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

  public static buildLocal(location: string) {
    const json = ResourceBuilder.Load(location);
    const novel = new Novel(json.novel.id, location);
    novel.resetHistory();
    novel.setAll(json.novel);

    novel.setHistory(json.history);

    return novel;
  }

  public static buildChapterLocal(novel: Novel, c: NovelChapterResourceType) {
    const chap = new NovelChapter(novel.id, c.number, c.name, novel.location, RevertTimestamp(c.date));
    chap.resetHistory();
    chap.pauseObserve();
    chap.status = NovelStatusUtils.ToStatus(c.status);
    chap.startObserve();
    return chap;
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
