/**
 * @internal
 * @module nd.novel
 */

import moment, { Moment } from "moment";

import { log } from "winston";
import { GetLink } from "../helpers/novel";
import { NOVEL_WARN } from "../constants/error.const";
import { join } from "path";
import { GetNovelNameApi, CreateChapterListApi, GetNovelDateApi, NormalizeNovelName } from "../apis/novel";
import { WrapTMCT } from "./LoggerWrapper";
import { COLORS } from "../constants/color.const";
import { DEFAULT_NOVEL_FOLDER_NAME } from "../constants/novel.const";
import { existsSync } from "fs";
import { mkdirpSync } from "fs-extra";
import { Exception } from "./Exception";
import { NovelChapter } from "./Chapter";
import { NovelBuilder } from "../builder/novel";
import { FetchApi } from "../apis/download";
import { HtmlBuilder } from "../builder/html";
import { WriteFile } from "../apis/file";

export class Novel {
  // TODO: add required information attribute
  _id: string;
  _location?: string;

  _name?: string;
  _chapters?: NovelChapter[];

  _downloadAt: Moment; // manually collect
  _updateAt?: Moment; // this from website

  constructor(id: string, location?: string) {
    this._id = id;
    if (location) this._location = location;

    this._downloadAt = moment();
  }

  update($: CheerioStatic) {
    this._updateAt = GetNovelDateApi($);
  }

  load($: CheerioStatic): Promise<Novel> {
    return new Promise(res => {
      this._name = GetNovelNameApi($);
      if (this._location)
        this._location = join(this._location, DEFAULT_NOVEL_FOLDER_NAME(NormalizeNovelName(this._name)));

      // this._chapters = [NovelBuilder.createChapter(this._id, "0", { location: this._location })];
      this._chapters = [];
      this._chapters.push(
        ...CreateChapterListApi($).map(chap => {
          chap.setLocation(this._location);
          return chap;
        })
      );

      this.update($);
      res(this);
    });
  }

  print(option?: { withChapter?: boolean }) {
    const link = GetLink(this._id);
    log(WrapTMCT("info", "Novel name", this._name, { message: COLORS.Name }));
    log(WrapTMCT("info", "Novel link", link));
    if (this._location) log(WrapTMCT("info", "Novel location", this._location));
    if (this._location) log(WrapTMCT("info", "First chapter", NovelBuilder.createZeroChapter(this).file()));
    log(
      WrapTMCT("info", "Chapters", this._chapters && this._chapters.map(c => c._chapterNumber), {
        message: COLORS.ChapterList
      })
    );
    if (this._chapters && option && option.withChapter) {
      this._chapters.forEach(chapter => {
        log(WrapTMCT("verbose", `Chapter ${chapter._chapterNumber}`, chapter.toString()));
      });
    }

    log(WrapTMCT("verbose", "Download at", this._downloadAt));
    log(WrapTMCT("verbose", "Update at", this._updateAt));
  }

  save(force?: boolean) {
    if (this._location && existsSync(this._location) && !force) {
      NOVEL_WARN.clone()
        .loadString(`Novel ID ${this._id} is exist`)
        .printAndExit();
      return;
    }

    mkdirpSync(this._location || "");

    NovelBuilder.createZeroChapter(this)
      .download(force)
      .then(() => {
        if (this._chapters) {
          this._chapters.forEach(v => {
            FetchApi(v)
              .then(res => {
                const html = HtmlBuilder.template(res.chapter._nid)
                  .addChap(res.chapter)
                  .addName(this._name)
                  .addContent(HtmlBuilder.buildContent(res.cheerio))
                  .renderDefault();
                WriteFile(html, res.chapter, force);
              })
              .catch((e: Exception) => {
                e.printAndExit();
              });
          });
        }
      })
      .catch((e: Exception) => {
        e.printAndExit();
      });
  }
}
