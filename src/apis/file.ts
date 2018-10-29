/**
 * @internal
 * @module nd.apis
 */

import { existsSync } from "fs";
import { writeFile } from "fs-extra";
import { log } from "winston";

import { FILE_ERR, NOVEL_WARN } from "../constants/error.const";
import { WrapTMC } from "../models/LoggerWrapper";
import { NovelChapter } from "../models/novel/Chapter";

export const WriteFile = (html: string, location: string, force?: boolean) => {
  return new Promise<string>((res, rej) => {
    if (!existsSync(location) || force) {
      writeFile(location, html, err => (err ? rej(err) : res(location)));
    } else {
      rej(FILE_ERR.clone().loadString(`${location} file is already exist`));
    }
  });
};

export const WriteChapter = (html: string, chapter: NovelChapter, force?: boolean) => {
  return new Promise<NovelChapter>((res, rej) => {
    if (!existsSync(chapter.file()) || force) {
      writeFile(chapter.file(), html, err => (err ? rej(err) : res(chapter)));
    } else {
      rej(NOVEL_WARN.clone().loadString(`Chapter ${chapter.number} of novel ${chapter.id} is exist`));
    }
  });
};
