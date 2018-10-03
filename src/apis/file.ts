/**
 * @internal
 * @module nd.apis
 */

import { log } from "winston";
import { NovelChapter } from "../models/Chapter";
import { existsSync } from "fs";
import { writeFile } from "fs-extra";
import { NOVEL_WARN } from "../constants/error.const";
import { WrapTMC } from "../models/LoggerWrapper";

export const WriteFile = (html: string, chapter: NovelChapter, force?: boolean) => {
  return new Promise<NovelChapter>((res, rej) => {
    if (!existsSync(chapter.file()) || force) {
      log(WrapTMC("debug", "Saved file", chapter.file()));
      writeFile(chapter.file(), html, err => (err ? rej(err) : res(chapter)));
    } else {
      rej(NOVEL_WARN.clone().loadString(`Chapter ${chapter._chapterNumber} of novel ${chapter._nid} is exist`));
    }
  });
};
