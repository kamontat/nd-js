/**
 * @internal
 * @module nd.novel.api
 */

import Bluebird from "bluebird";
import { existsSync } from "fs";
import { writeFile } from "fs-extra";

import { FILE_ERR, NOVEL_WARN } from "../constants/error.const";
import { NovelChapter } from "../models/novel/Chapter";

export const WriteFile = (html: string, location: string, force?: boolean) => {
  return new Bluebird<string>((res, rej) => {
    if (!existsSync(location) || force) {
      writeFile(location, html, err => (err ? rej(err) : res(location)));
    } else {
      rej(FILE_ERR.clone().loadString(`${location} file is already exist`));
    }
  });
};

export const WriteChapter = (html: string, chapter: NovelChapter, force?: boolean) => {
  return new Bluebird<NovelChapter>((res, rej) => {
    if (!existsSync(chapter.file()) || force) {
      writeFile(chapter.file(), html, err => (err ? rej(err) : res(chapter)));
    } else {
      rej(NOVEL_WARN.clone().loadString(`Chapter ${chapter.number} of novel ${chapter.id} is exist`));
    }
  });
};
