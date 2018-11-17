/**
 * @internal
 * @module nd.novel.api
 */

import Bluebird from "bluebird";
import { pathExists, writeFile } from "fs-extra";

import { FILE_ERR } from "../constants/error.const";
import { NovelChapter } from "../models/novel/Chapter";

/**
 * Writer class is a one of utils class in this command. This class respond to writing content to file.
 *
 *
 * @author Kamontat Chantrachirathumrong
 * @version 1.0.0
 * @since November 16, 2018
 */
export class Writer {
  /**
   * This will write the content to file use promise technology (Bluebird)
   *
   * @param html content string (usually will be HTML format)
   * @param path the file path (must be full path)
   * @param force force to save the file even it exist
   *
   * @author Kamontat Chantrachirathumrong
   * @since November 11, 2018
   *
   * @version 1.0.1
   * @version 1.1.0 - Make the method return Bluebird instead of normal Promise
   */
  public static ByPath(html: string, path: string, force?: boolean): Bluebird<string> {
    if (force)
      return new Bluebird((res, rej) => {
        return writeFile(path, html)
          .then(_ => res(path))
          .catch(e => rej(e));
      });

    return new Bluebird((res, rej) => {
      return pathExists(path)
        .then(isExist => {
          if (!isExist) {
            return writeFile(path, html);
          } else {
            return Bluebird.reject(FILE_ERR.clone().loadString(`${path} file is already exist`));
          }
        })
        .then(_ => res(path))
        .catch(e => rej(e));
    });
  }

  /**
   * This will almost the same as {@link Writer.ByPath} except you need to pass chapter instead of file path
   *
   * @param html content string (usually will be HTML format)
   * @param chapter Chapter to be saved
   * @param force force save the result even file is exist
   *
   * @author Kamontat Chantrachirathumrong
   * @version 1.0.1
   * @since November 11, 2018
   */
  public static ByChapter(html: string, chapter: NovelChapter, force?: boolean) {
    return Writer.ByPath(html, chapter.file(), force).then(_ => Bluebird.resolve(chapter));
  }
}
