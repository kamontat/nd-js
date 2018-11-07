/**
 * @internal
 * @module nd.apis
 */

import { locale } from "moment";
import moment = require("moment");
import "moment/locale/th";
import { log } from "winston";

import { NovelBuilder } from "../builder/novel";
import { COLORS } from "../constants/color.const";
import { NOVEL_CLOSED_WARN, NOVEL_SOLD_WARN, NOVEL_WARN } from "../constants/error.const";
import { HTML_BLACKLIST_TEXT } from "../constants/html.const";
import { DEFAULT_NOVEL_LINK } from "../constants/novel.const";
import { CheckIsExist, FormatMomentDateTime, TrimString } from "../helpers/helper";
import { GetChapterNumber, PassLink } from "../helpers/novel";
import { HtmlNode } from "../models/html/HtmlNode";
import { NovelChapter } from "../models/novel/Chapter";
import { WrapTM, WrapTMCT } from "../models/output/LoggerWrapper";

import { Query } from "./html";

export const GetNovelNameApi = ($: CheerioStatic) => {
  // //p[@id="big_text"]/text()
  let name = $("p#big_text").text();
  if (!name || name === "") {
    // //td[@class="head1"]/h1/text()
    name = $("td.head1").text();
  }
  return name.trim();
};

// Support only version 2
export const GetChapterDateListApiV2 = ($: CheerioStatic): Cheerio => {
  const result = $(".update-txt");
  log(WrapTMCT("debug", `Chapter date length`, result.length));
  return result;
};

// Support version 1 and version 2
export const GetChapterDateApi = ($: CheerioStatic): moment.Moment => {
  let dateString = $($(".timeupdate").get(0)).text();
  if (!CheckIsExist(dateString))
    dateString = $("td[bgcolor=#A3A3A3]")
      .first()
      .children("font")
      .text()
      .replace("อัพเดท ", "")
      .trim();
  log(WrapTMCT("debug", "INDV Chapter date", dateString));
  return FormatMomentDateTime(dateString, "D MMM YY");
};

// Support version 1 and version 2
export const GetNovelDateApi = ($: CheerioStatic): moment.Moment => {
  let dateString = $(".writer-section-head")
    .find("span")
    .text()
    .replace("อัพเดท ", "")
    .trim();

  // second try
  if (!CheckIsExist(dateString)) {
    dateString = $(".head2")
      .children("font[color=#896700]")
      .first()
      .text()
      .replace("-  อัพเดท", "")
      .trim();
  }

  log(WrapTMCT("debug", "Novel date string", dateString));

  // 29 ก.ย. 61 / 19:00
  const date = FormatMomentDateTime(dateString, "D MMM YY [/] HH:mm");
  log(WrapTMCT("debug", "novel date", date, { message: COLORS.DateTime }));

  return date;
};

export const CreateChapterListApi = ($: CheerioStatic): NovelChapter[] => {
  const chapters: { [key: string]: NovelChapter } = {};

  const query = Query($, c => c.length > 0, "a.chapter-item-name[target=_blank]", "a[target=_blank]");
  if (!query) {
    throw NOVEL_WARN.clone().loadString("cannot get chapter list");
  }

  const dateQuery = GetChapterDateListApiV2($);

  query.each((i, e) => {
    const link = `${DEFAULT_NOVEL_LINK}/${$(e).attr("href")}`;
    let title = TrimString($(e).attr("title"));
    const sold = $(e)
      .parentsUntil(".chapter-item")
      .hasClass("chapter-sell");

    const closed = $(e)
      .parentsUntil(".chapter-item")
      .hasClass("chapter-state-hidden");
    if (!CheckIsExist(title)) {
      title = TrimString($(e).text());
    }

    if (link.includes("viewlongc.php")) {
      locale("th");
      let dateString = $(dateQuery.get(i)).text();
      if (!CheckIsExist(dateString)) {
        dateString =
          $(e)
            .parent()
            .parent()
            .contents()
            .last()
            .html() || "";

        log(WrapTMCT("debug", "Chapter date (string)", dateString));
      }

      // 28 ก.ย. 61
      const date = FormatMomentDateTime(dateString, "D MMM YY");
      log(WrapTMCT("debug", "Chapter date", date));

      const chapterNumber = GetChapterNumber(link);

      const builtChapter = NovelBuilder.createChapterByLink(PassLink(link), { name: title, date });
      if (sold) builtChapter.markSell();
      else if (closed) builtChapter.markClose();
      // else builtChapter.markComplete();

      // For debugging
      const savedChapter = chapters[chapterNumber];
      // to avoid deplicate chapter chapter
      if (savedChapter === undefined) {
        log(WrapTM("debug", "chapter link", `${link}`));
        log(WrapTM("debug", "chapter title", title));
        log(WrapTM("debug", "date", date));
      }

      chapters[chapterNumber] = builtChapter;
    }
  });
  return Object.values(chapters);
};

export const GetChapterNameApi = ($: CheerioStatic) => {
  // h2[@class="chaptername"]/text()
  let name = $(".chaptername")
    .first()
    .text();
  if (name && name !== "") {
    return name;
  }

  // FIXME: cannot find any usecase to test
  // div[@class="big_next"]/p[@class="font_nu01"]/text()
  // name = $("td.head1").text();
  // if (name && name !== "") return name;

  const element = $("h2[style=margin\\:0px\\;font-size\\:17px\\;color\\:\\#ffffff]");
  name = element.text();
  if (name && name !== "") {
    return name;
  }

  return "";
};

export const getNovelContentV1 = ($: CheerioStatic) => {
  const result: HtmlNode[] = [];

  // เรื่องย่อ
  const header = $("span.desc_head")
    .parent()
    .get(0);
  const headText = $(header)
    .text()
    .replace("แนะนำเรื่องแบบย่อๆ", "");

  if (headText !== null && headText !== "") {
    result.push(
      new HtmlNode({
        tag: "p",
        text: headText,
      }),
    );
  }
  // end

  $("table#story_body")
    .children()
    .children()
    .children()
    .contents()
    .each((_, e) => {
      const query = $(e);

      if (query.html() === "" || query.html() === null) {
        const text = query.text().trim();
        if (text !== "" && text !== "\n") {
          // log(WrapTMC("debug", "Content", text));
          result.push(
            new HtmlNode({
              tag: "p",
              text,
            }),
          );
        }
      }
    });

  return result;
};

export const getNovelContentV2 = ($: CheerioStatic) => {
  const result: HtmlNode[] = [];

  $("div#story-content")
    .contents()
    .each((_, e) => {
      const query = $(e);

      const text = query.text().trim();
      if (text !== "" && text !== "\n") {
        // filter text that contain in BlackList
        if (HTML_BLACKLIST_TEXT.filter(v => text.includes(v)).length < 1) {
          // log(WrapTMC("debug", "Html paragraph node", text.substr(0, 20))); // limit 20 first chap

          // FIXME: sometime cause all text go to 1 node (1851491 chap=5)
          result.push(
            new HtmlNode({
              tag: "p",
              text,
            }),
          );
        }
      }
    });
  return result;
};

export const GetNovelContent = (chapter: NovelChapter, $: CheerioStatic) => {
  let result: HtmlNode[] = [];
  if ($("div#story-content").text() !== "") {
    log(WrapTM("debug", `${chapter.id}, at chap ${chapter.number}`, "version 2"));
    result = getNovelContentV2($);
  } else {
    log(WrapTM("debug", `${chapter.id}, at chap ${chapter.number}`, "version 1"));
    result = getNovelContentV1($);
  }

  log(WrapTM("debug", "Result of novel content", result.map(node => node.text).join("|")));

  if (result.some(node => node.text.includes("ตอนนี้เป็นส่วนหนึ่งในแพ็กเกจนิยาย"))) {
    log(WrapTMCT("debug", `${chapter.id} => ${chapter.number} status`, "Sell!! "));
    throw NOVEL_SOLD_WARN.clone();
  } else if (result.some(node => node.text.includes("ผู้แต่งปิดการเข้าถึง"))) {
    log(WrapTMCT("debug", `${chapter.id} => ${chapter.number} status`, "Close!! "));
    throw NOVEL_CLOSED_WARN.clone();
  }

  if (result.length < 1) {
    // log(WrapTM("debug", "The raw result", $.html()));
    NOVEL_WARN.clone()
      .loadString(`Cannot get ${chapter.id} chapter ${chapter.number} content`)
      .printAndExit();
  }

  return result;
};

export const CheckIsNovel = ($: CheerioStatic) => {
  return $(".txt-content").length < 1;
};

export const NormalizeNovelName = (name: string) => {
  return name.replace(/([ \n\t\r\n])/g, "-").replace(/([\(\)\[\]\&\%\$\#\@\^\*])/g, "_");
};
