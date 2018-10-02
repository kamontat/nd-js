/**
 * @internal
 * @module nd.apis
 */

import { DEFAULT_NOVEL_LINK } from "../constants/novel.const";

import { log } from "winston";
import { WrapTM, WrapTMC } from "../models/LoggerWrapper";

import { NovelChapter, NovelBuilder } from "../models/Novel";
import { PassLink, GetChapter } from "../helpers/novel";

import { CreateHtmlApi, Query } from "./html";

import { HtmlNode } from "../models/Html";
import { HTML_BLACKLIST_TEXT } from "../constants/html.const";

import "moment/locale/th";
import { locale } from "moment";
import moment = require("moment");
import { FormatMomentDateTime } from "../helpers/date";
import { TrimString, CheckIsExist } from "../helpers/helper";
import { NOVEL_ERR, NOVEL_WARN } from "../constants/error.const";

export const GetNovelNameApi = ($: CheerioStatic) => {
  // //p[@id="big_text"]/text()
  let name = $("p#big_text").text();
  if (!name || name === "") {
    // //td[@class="head1"]/h1/text()
    name = $("td.head1").text();
  }
  return name.trim();
};

// support v2 only
export const GetChapterDateListApi = ($: CheerioStatic): Cheerio => {
  return $(".update-txt");
};

// support v2 only
// TODO: make support v1 novel
export const GetNovelDateApi = ($: CheerioStatic): moment.Moment => {
  const dateString = $(".writer-section-head")
    .find("span")
    .text()
    .replace("อัพเดท ", "");
  // 29 ก.ย. 61 / 19:00
  const date = FormatMomentDateTime(dateString, "D MMM YY [/] HH:mm");
  log(WrapTMC("debug", "novel date", date));
  return date;
};

export const CreateChapterListApi = ($: CheerioStatic): NovelChapter[] => {
  const chapterLink: { [key: string]: { link: string; title: string; date: moment.Moment } } = {};

  let query = Query($, c => c.length > 0, "a.chapter-item-name[target=_blank]", "a[target=_blank]");
  if (!query) throw NOVEL_WARN.clone().loadString("cannot get chapter list");

  let dateQuery = GetChapterDateListApi($);

  query.each(function(i, e) {
    let link = `${DEFAULT_NOVEL_LINK}/${$(e).attr("href")}`;
    let title = TrimString($(e).attr("title"));
    if (!CheckIsExist(title)) title = TrimString($(e).text());

    if (link.includes("viewlongc.php")) {
      locale("th");
      // 28 ก.ย. 61
      const date = FormatMomentDateTime($(dateQuery.get(i)).text(), "D MMM YY");
      const chapter = GetChapter(link);

      // to avoid deplicate chapter chapter
      if (chapterLink[chapter] === undefined) {
        log(WrapTM("debug", "chapter link", `${DEFAULT_NOVEL_LINK}/${link}`));
        log(WrapTM("debug", "chapter title", title));
        log(WrapTM("debug", "date", date));
      }

      chapterLink[chapter] = {
        link: link,
        title: title,
        date: date
      };
    }
  });

  return Object.values(chapterLink).map(({ link, title, date }) =>
    NovelBuilder.createChapterByLink(PassLink(`${DEFAULT_NOVEL_LINK}/${link}`), { name: title, date: date })
  );
};

export const GetChapterNameApi = ($: CheerioStatic) => {
  // h2[@class="chaptername"]/text()
  let name = $(".chaptername")
    .first()
    .text();
  if (name && name !== "") return name;

  // FIXME: cannot find any usecase to test
  // div[@class="big_next"]/p[@class="font_nu01"]/text()
  // name = $("td.head1").text();
  // if (name && name !== "") return name;

  let element = $("h2[style=margin\\:0px\\;font-size\\:17px\\;color\\:\\#ffffff]");

  name = element.text();
  if (name && name !== "") return name;

  return "";
  // throw NovelWarning.clone().loadString("Cannot get chapter name");
};

export const GetNovelContent = (chapter: NovelChapter, $: CheerioStatic) => {
  let result: HtmlNode[] = [];

  if ($("div#story-content").text() !== "") {
    $("div#story-content")
      .contents()
      .each(function(_, e) {
        let query = $(e);

        const text = query.text().trim();
        if (text !== "" && text !== "\n") {
          // filter text that contain in BlackList
          if (HTML_BLACKLIST_TEXT.filter(v => text.includes(v)).length < 1) {
            log(WrapTMC("debug", "Html paragraph node", text));

            // FIXME: sometime cause all text go to 1 node (1851491 chap=5)
            result.push({
              tag: "p",
              text: text
            });
          }
        }
      });
  } else {
    $("table#story_body")
      .children()
      .children()
      .children()
      .contents()
      .each(function(_, e) {
        let query = $(e);

        if (query.html() === "" || query.html() === null) {
          const text = query.text().trim();
          if (text !== "" && text !== "\n") {
            // log(WrapTMC("debug", "Content", text));
            result.push({
              tag: "p",
              text: text
            });
          }
        }
      });
  }

  return CreateHtmlApi(chapter, result);
};

export const CheckIsNovel = ($: CheerioStatic) => {
  return $(".txt-content").length < 1;
};
