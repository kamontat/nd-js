import request from "request-promise";
import { log } from "winston";
import { load } from "cheerio";
import { Response } from "request";
import { decode } from "iconv-lite";

import { NovelChapter } from "../models/Novel";
import { WrapTMC } from "../models/LoggerWrapper";
import { NovelWarning } from "../constants/error.const";
import { API_GET_NOVEL_CONTENT, API_GET_NOVEL_CHAPTER_NAME, API_IS_NOVEL } from "./novel";
import { writeFileSync } from "fs";

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

export const API_DOWNLOAD: (b: NovelChapter) => Promise<{ cheerio: CheerioStatic; chapter: NovelChapter }> = (
  chapter: NovelChapter
) => {
  log(WrapTMC("verbose", "Start download link", chapter.link()));
  log(WrapTMC("verbose", "Start download file", chapter.file()));

  return new Promise((res, rej) => {
    return download(chapter.link()).then(($: CheerioStatic) => {
      if (API_IS_NOVEL($)) {
        return res({ cheerio: $, chapter: chapter });
      } else {
        return rej(
          NovelWarning.clone().loadString(`Novel(${chapter._nid}) on chapter ${chapter._chapterNumber} is not exist`)
        );
      }
    });
  });
};

// TODO: Add multiple thread downloader https://github.com/tusharmath/Multi-threaded-downloader

// TODO: Add progressbar https://github.com/visionmedia/node-progress
