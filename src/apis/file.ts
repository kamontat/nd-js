/**
 * @internal
 * @module nd.apis
 */

import { log } from "winston";
import { NovelChapter } from "../models/Chapter";
import { existsSync } from "fs";
import { writeFile } from "fs-extra";
import { NOVEL_WARN, FILE_ERR } from "../constants/error.const";
import { WrapTMC } from "../models/LoggerWrapper";

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
