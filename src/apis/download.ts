/**
 * @internal
 * @module nd.apis
 */

import request from "request-promise";
import { log } from "winston";
import { load } from "cheerio";
import { Response } from "request";
import { decode } from "iconv-lite";

import { NovelChapter } from "../models/Novel";
import { WrapTMC } from "../models/LoggerWrapper";
import { NOVEL_WARN } from "../constants/error.const";
import { CheckIsNovel, BuildNovelHtml } from "./novel";
import { writeFile, existsSync } from "fs-extra";

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
  log(WrapTMC("debug", "Start download link", chapter.link()));

  return new Promise((res, rej) => {
    return download(chapter.link()).then(($: CheerioStatic) => {
      if (CheckIsNovel($)) {
        return res({ cheerio: $, chapter: chapter });
      } else {
        return rej(
          NOVEL_WARN.clone().loadString(`Novel(${chapter._nid}) on chapter ${chapter._chapterNumber} is not exist`)
        );
      }
    });
  });
};

export const DownloadApi: (chapter: NovelChapter, force?: boolean) => Promise<NovelChapter> = (
  chapter: NovelChapter,
  force?: boolean
) => {
  return FetchApi(chapter).then(res => {
    const html = BuildNovelHtml(res.chapter, res.cheerio);
    return new Promise<NovelChapter>((res, rej) => {
      if (!existsSync(chapter.file()) || force) writeFile(chapter.file(), html, err => (err ? rej(err) : res(chapter)));
      else rej(NOVEL_WARN.clone().loadString(`Chapter ${chapter._chapterNumber} of novel ${chapter._nid} is exist`));
    });
  });
};

// TODO: Add multiple thread downloader https://github.com/tusharmath/Multi-threaded-downloader

// TODO: Add progressbar https://github.com/visionmedia/node-progress
