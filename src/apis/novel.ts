/**
 * @internal
 * @module nd.novel.api
 */

import { locale } from "moment";
import moment = require("moment");
import "moment/locale/th";
import { log } from "winston";

import { NovelBuilder } from "../builder/novel";
import { COLORS } from "../constants/color.const";
import { NOVEL_WARN } from "../constants/error.const";
import { ATTR_BLACKLIST, HTML_BLACKLIST_TEXT } from "../constants/html.const";
import { DEFAULT_NOVEL_LINK } from "../constants/novel.const";
import { CheckIsExist, FormatMomentDateTime, TrimString } from "../helpers/helper";
import { GetChapterNumber, PassLink } from "../helpers/novel";
import { HtmlNode } from "../models/html/HtmlNode";
import { NovelChapter } from "../models/novel/Chapter";

import { Query } from "./html";
import { WrapTM, WrapTMC, WrapTMCT } from "./loggerWrapper";

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
const GetChapterDateListApiV2 = ($: CheerioStatic): Cheerio => {
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

const getTitleElement = (element: Cheerio): string => {
  // For version 2
  const title = TrimString(element.attr("title"));
  if (CheckIsExist(title)) return title;
  // For version 1
  return TrimString(element.text());
};

const getDateElement = (element: Cheerio): string => {
  return (
    element
      .parent()
      .parent()
      .contents()
      .last()
      .html() || ""
  );
};

const isSoldElement = (cheerio: Cheerio): boolean => {
  return cheerio.parentsUntil(".chapter-item").hasClass("chapter-sell");
};

const isClosedElement = (cheerio: Cheerio): boolean => {
  return cheerio.parentsUntil(".chapter-item").hasClass("chapter-state-hidden");
};

export const CreateChapterListApi = ($: CheerioStatic): NovelChapter[] => {
  const chapters: { [key: string]: NovelChapter } = {};

  const query = Query($, c => c.length > 0, "a.chapter-item-name[target=_blank]", "a[target=_blank]");
  if (!query) throw NOVEL_WARN.clone().loadString("cannot get chapter list");

  const dateQuery = GetChapterDateListApiV2($);

  locale("th");
  query.each((i, e) => {
    const element = $(e);

    const link = `${DEFAULT_NOVEL_LINK}/${element.attr("href")}`;
    const title = getTitleElement(element);

    if (link.includes("viewlongc.php")) {
      const chapterNumber = GetChapterNumber(link);

      // version 2
      let dateString = $(dateQuery.get(i)).text();
      // version 1
      if (!CheckIsExist(dateString)) dateString = getDateElement(element);

      log(WrapTMCT("debug", "Chapter date (string)", dateString));
      // 28 ก.ย. 61
      const date = FormatMomentDateTime(dateString, "D MMM YY");

      const builtChapter = NovelBuilder.createChapterByLink(PassLink(link), { name: title, date });
      if (isSoldElement(element)) builtChapter.markSell();
      else if (isClosedElement(element)) builtChapter.markClose();

      // to avoid deplicate chapter, show only first match
      if (chapters[chapterNumber] === undefined) {
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

  const element = $("h2[style=margin\\:0px\\;font-size\\:17px\\;color\\:\\#ffffff]");
  name = element.text();
  if (name && name !== "") {
    return name;
  }

  return "";
};

export const getShortContentV1 = ($: CheerioStatic) => {
  const header = $("span.desc_head")
    .parent()
    .get(0);
  const headText = $(header)
    .text()
    .replace("แนะนำเรื่องแบบย่อๆ", "");

  if (headText !== null && headText !== "") {
    return new HtmlNode({
      tag: "p",
      text: headText,
    });
  }
  return;
};

export const getNovelContentV1 = ($: CheerioStatic) => {
  const result: HtmlNode[] = [];
  const short = getShortContentV1($);
  if (short) result.push(short);

  $("table#story_body")
    .children()
    .children()
    .children()
    .contents()
    .each((_, e) => {
      const query = $(e);
      const text = query.text().trim();
      if (text !== "" && text !== "\n") {
        if (HTML_BLACKLIST_TEXT.filter(v => text.includes(v)).length < 1) {
          log(WrapTMC("debug", "<p>TAG</p>", text));

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

const getShortContentV2 = ($: CheerioStatic) => {
  // เรื่องย่อ
  const headText = $(".desc_sub").text();
  if (headText !== null && headText !== "") {
    return new HtmlNode({
      tag: "p",
      text: headText,
    });
  }
  return;
};

const getFirstContentV2 = ($: CheerioStatic) => {
  const text = $("div#story-content")
    .contents()
    .first()
    .text()
    .trim();

  if (text && text !== "")
    return new HtmlNode({
      tag: "p",
      text,
    });
  return;
};

const getPContentV2 = ($: CheerioStatic) => {
  const result: HtmlNode[] = [];
  const content = $("div#story-content").find("p");
  content.each((_, e) => {
    const query = $(e);
    const text = query.text().trim();
    if (text !== "" && text !== "\n") {
      log(WrapTM("debug", "The individual content (get P)", text));
      result.push(
        new HtmlNode({
          tag: "p",
          text,
        }),
      );
    }
  });

  return result;
};

const getDivContentV2 = ($: CheerioStatic) => {
  const result: HtmlNode[] = [];
  const content = $("div#story-content").find("div");
  content.each((_, e) => {
    const query = $(e);

    // filter unused element
    if (e.attribs) {
      if (
        ATTR_BLACKLIST.filter(blacklist => {
          const attr = e.attribs[blacklist.key];
          return attr && attr.includes(blacklist.value);
        }).length > 0
      ) {
        return;
      }
    }

    const text = query.text().trim();
    if (text !== "" && text !== "\n") {
      log(WrapTM("debug", "The individual content (get Div)", text));
      result.push(
        new HtmlNode({
          tag: "p",
          text,
        }),
      );
    }
  });
  return result;
};

export const getNovelContentV2 = ($: CheerioStatic) => {
  const result: HtmlNode[] = [];
  const short = getShortContentV2($);
  if (short) result.push(short);

  const firstContent = getFirstContentV2($);
  if (firstContent) result.push(firstContent);

  const rawP = getPContentV2($);
  if (rawP) result.push(...rawP);

  const rawDiv = getDivContentV2($);
  if (rawDiv) result.push(...rawDiv);

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
    chapter.markSell();
    return;
  } else if (
    result.some(node => node.text.includes("ผู้แต่งปิดการเข้าถึง") || node.text.includes("เนื้อหานิยายตอนนี้ถูกซ่อน"))
  ) {
    log(WrapTMCT("debug", `${chapter.id} => ${chapter.number} status`, "Close!! "));
    chapter.markClose();
    return;
  }

  if (result.length < 1)
    throw NOVEL_WARN.clone().loadString(`Cannot get ${chapter.id} chapter ${chapter.number} content`);

  return result;
};

export const CheckIsNovel = ($: CheerioStatic) => {
  return $(".txt-content").length < 1;
};

export const NormalizeNovelName = (name: string) => {
  return name.replace(/([ \n\t\r\n])/g, "-").replace(/([\(\)\[\]\&\%\$\#\@\^\*])/g, "_");
};
