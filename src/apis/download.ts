/**
 * @internal
 * @module nd.apis
 */

import Bluebird, { Promise } from "bluebird";
import { load } from "cheerio";
import { decode } from "iconv-lite";
import { Response } from "request";
import request from "request-promise";
import { RequestError } from "request-promise/errors";

import { HtmlBuilder } from "../builder/html";
import { DOWNLOAD_ERR, NOVEL_WARN } from "../constants/error.const";
import { NovelChapter } from "../models/novel/Chapter";

import { WriteChapter } from "./file";
import { CheckIsNovel, GetChapterDateApi, GetChapterNameApi, GetNovelNameApi } from "./novel";

function download(url: URL) {
  return request({
    url: url.toString(),
    method: "GET",
    headers: {
      "accept": "*/*",
      "user-agent": "*",
    },
    encoding: null,
    transform(body, response: Response) {
      const contentType: string = response.headers["content-type"] || "";

      let result: string = body;
      if (contentType.includes("charset=UTF-8")) {
        result = decode(body, "UTF-8");
      } else if (contentType.includes("charset=TIS-620")) {
        result = decode(body, "ISO-8859-11");
      }

      return load(result, {
        normalizeWhitespace: true,
        xmlMode: false,
        decodeEntities: false,
      });
    },
  });
}

export const FetchApi: (chapter: NovelChapter) => Bluebird<{ cheerio: CheerioStatic; chapter: NovelChapter }> = (
  chapter: NovelChapter,
) => {
  return new Promise((res, rej) => {
    return download(chapter.link())
      .then(($: CheerioStatic) => {
        if (CheckIsNovel($)) {
          chapter.name = GetChapterNameApi($);
          chapter.date = GetChapterDateApi($);
          return res({ cheerio: $, chapter });
        } else {
          return rej(NOVEL_WARN.clone().loadString(`Novel(${chapter.id}) on chapter ${chapter.number} is not exist`));
        }
      })
      .catch(e => {
        if (e instanceof RequestError) {
          return rej(DOWNLOAD_ERR.clone().loadString("No internet connection"));
        }
        return rej(e);
      });
  });
};

export const DownloadChapter = (chapter: NovelChapter, force?: boolean) => {
  return FetchApi(chapter).then(res => {
    const html = HtmlBuilder.template(res.chapter.id)
      .addName(GetNovelNameApi(res.cheerio))
      .addChap(res.chapter)
      .addContent(HtmlBuilder.buildContent(res.chapter, res.cheerio))
      .renderDefault();

    return WriteChapter(html, res.chapter, force);
  });
};

export const DownloadChapters = (force: boolean | undefined, chapters: NovelChapter[]) => {
  return Promise.each(chapters, item => {
    return DownloadChapter(item, force);
  });
};

// TODO: Add multiple thread downloader https://github.com/tusharmath/Multi-threaded-downloader
