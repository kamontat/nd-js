/**
 * @internal
 * @module nd.apis
 */

import request from "request-promise";
import { load } from "cheerio";
import { Response } from "request";
import { decode } from "iconv-lite";

import { NovelChapter } from "../models/Chapter";
import { NOVEL_WARN } from "../constants/error.const";
import { CheckIsNovel, GetChapterNameApi, GetChapterDateApi, GetNovelNameApi } from "./novel";
import { HtmlBuilder } from "../builder/html";
import { WriteChapter } from "./file";

function download(url: URL) {
  return request({
    url: url.toString(),
    method: "GET",
    headers: {
      accept: "*/*",
      "user-agent": "*"
    },
    encoding: null,
    transform: function(body, response: Response) {
      let contentType: string = response.headers["content-type"] || "";

      let result: string = body;
      if (contentType.includes("charset=UTF-8")) {
        result = decode(body, "UTF-8");
      } else if (contentType.includes("charset=TIS-620")) {
        result = decode(body, "ISO-8859-11");
      }

      return load(result, {
        normalizeWhitespace: true,
        xmlMode: false,
        decodeEntities: false
      });
    }
  });
}

export const FetchApi: (chapter: NovelChapter) => Promise<{ cheerio: CheerioStatic; chapter: NovelChapter }> = (
  chapter: NovelChapter
) => {
  return new Promise((res, rej) => {
    return download(chapter.link()).then(($: CheerioStatic) => {
      if (CheckIsNovel($)) {
        chapter.setName(GetChapterNameApi($));
        chapter.setDate(GetChapterDateApi($));
        return res({ cheerio: $, chapter: chapter });
      } else {
        return rej(NOVEL_WARN.clone().loadString(`Novel(${chapter.id}) on chapter ${chapter.number} is not exist`));
      }
    });
  });
};

export const DownloadChapter: (chapter: NovelChapter, force?: boolean) => Promise<NovelChapter> = (
  chapter: NovelChapter,
  force?: boolean
) => {
  return FetchApi(chapter).then(res => {
    const html = HtmlBuilder.template(res.chapter.id)
      .addName(GetNovelNameApi(res.cheerio))
      .addChap(res.chapter)
      .addContent(HtmlBuilder.buildContent(res.cheerio))
      .renderDefault();

    return WriteChapter(html, res.chapter, force);
  });
};

export const DownloadChapters: (force: boolean | undefined, chapters: NovelChapter[]) => Promise<NovelChapter[]> = (
  force: boolean | undefined,
  chapters: NovelChapter[]
) => {
  return Promise.all(chapters.map(c => DownloadChapter(c, force)));
};

// TODO: Add multiple thread downloader https://github.com/tusharmath/Multi-threaded-downloader

// TODO: Add progressbar https://github.com/visionmedia/node-progress
