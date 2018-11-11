/**
 * @internal
 * @module nd.novel.api
 */

import Bluebird from "bluebird";
import { existsSync } from "fs";
import { pathExists, writeFile } from "fs-extra";

import { FILE_ERR, NOVEL_WARN } from "../constants/error.const";
import { NovelChapter } from "../models/novel/Chapter";

export namespace Writer {
  /**
   * This will write the content to file use promise technology (Bluebird)
   *
   * @param html content string (usually will be HTML format)
   * @param path the file path (must be full path)
   * @param force force to save the file even it exist
   *
   * @author Kamontat Chantrachirathumrong
   * @version 1.0.0
   * @since November 11, 2018
   */
  export const ByPath = (html: string, path: string, force?: boolean) => {
    if (force)
      return writeFile(path, html)
        .then(_ => Bluebird.resolve(path))
        .catch(e => Bluebird.reject(e));

    return pathExists(path).then(isExist => {
      if (isExist) {
        return writeFile(path, html)
          .then(_ => Bluebird.resolve(path))
          .catch(e => Bluebird.reject(e));
      } else {
        return Bluebird.reject(FILE_ERR.clone().loadString(`${location} file is already exist`));
      }
    });
  };

  /**
   * This will almost the same as {@link Writer.ByPath} except you need to pass chapter instead of file path
   *
   * @param html content string (usually will be HTML format)
   * @param chapter Chapter to be saved
   * @param force force save the result even file is exist
   *
   * @author Kamontat Chantrachirathumrong
   * @version 1.0.0
   * @since November 11, 2018
   */
  export const ByChapter = (html: string, chapter: NovelChapter, force?: boolean) => {
    return ByPath(html, chapter.file(), force).then(_ => Bluebird.resolve(chapter));
  };
}
