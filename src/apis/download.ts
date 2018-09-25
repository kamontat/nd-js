import request from "request-promise";
import { log } from "winston";
import { load } from "cheerio";
import { Response } from "request";
import { decode } from "iconv-lite";

import { NovelChapter } from "../models/Novel";
import { WrapTMC, WrapTM } from "../models/LoggerWrapper";
import { DownloadError } from "../constants/error.const";
import { GetNovelContent } from "./novel";

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

// TODO: make download using axios library
export const DownloadAPI = (chapter: NovelChapter) => {
  log(WrapTMC("debug", "start download", `${chapter.link().toString()} ${chapter.file()}`));
  download(chapter.link())
    .then(($: CheerioStatic) => {
      console.log(GetNovelContent($));
      // console.log(v);
    })
    .catch(e => {
      throw DownloadError.clone().loadError(e);
    });
};

// TODO: Add multiple thread downloader https://github.com/tusharmath/Multi-threaded-downloader

// TODO: Add progressbar https://github.com/visionmedia/node-progress
