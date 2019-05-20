/**
 * @internal
 * @module nd.novel.api
 */

import Bluebird, { Promise } from "bluebird";
import { load } from "cheerio";
import { decode } from "iconv-lite";
import { Response } from "request";
import request from "request-promise";
import { RequestError } from "request-promise/errors";

import { CHAPTER_NOTFOUND_WARN, DOWNLOAD_ERR, NOVEL_NOTFOUND_ERR, NOVEL_WARN } from "../constants/error.const";
import { NovelChapter } from "../models/novel/Chapter";

import { CheckIsNovel, GetChapterDateApi, GetChapterNameApi } from "./novel";

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

          chapter.markComplete();
          return res({ cheerio: $, chapter });
        } else {
          return rej(CHAPTER_NOTFOUND_WARN.clone().loadString(`Novel(${chapter.id}) chapter ${chapter.number}`));
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

// TODO: Add multiple thread downloader https://github.com/tusharmath/Multi-threaded-downloader
