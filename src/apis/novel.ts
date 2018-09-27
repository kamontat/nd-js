import { NOVEL_LINK } from "../constants/novel.const";

import { log } from "winston";
import { WrapTM, WrapTMC } from "../models/LoggerWrapper";

import { NovelChapter, NovelBuilder } from "../models/Novel";
import { PassLink, GetChapter } from "../helpers/novel";

import { MakeHTML } from "./html";

import { HtmlNode } from "../models/Html";
import { DEFAULT_HTML_BLACKLIST_TEXT } from "../constants/htmlConst";
import { NovelWarning } from "../constants/error.const";

export const GetNovelName = ($: CheerioStatic) => {
  // //p[@id="big_text"]/text()
  let name = $("p#big_text").text();
  if (!name || name === "") {
    // //td[@class="head1"]/h1/text()
    name = $("td.head1").text();
  }
  return name;
};

export const GetNovelChapters = ($: CheerioStatic): NovelChapter[] => {
  let chapterLink: { [key: string]: { link: string; title: string } } = {};
  $("a[target=_blank]").each(function(_, e) {
    let link = $(e).attr("href");
    let title = $(e).attr("title");
    if (link && link.includes("viewlongc.php")) {
      const chapter = GetChapter(`${NOVEL_LINK}/${link}`);

      // to avoid deplicate chapter chapter
      if (chapterLink[chapter] === undefined) {
        log(WrapTM("debug", "chapter link", link));
        log(WrapTM("debug", "chapter title", title));
      }

      chapterLink[chapter] = {
        link: link,
        title: title
      };
    }
  });

  return Object.values(chapterLink).map(({ link, title }) =>
    NovelBuilder.createChapterByLink(PassLink(`${NOVEL_LINK}/${link}`), { name: title })
  );
};

export const GetChapterName = ($: CheerioStatic) => {
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
          if (DEFAULT_HTML_BLACKLIST_TEXT.filter(v => text.includes(v)).length < 1) {
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

  return MakeHTML(chapter, result);
};

export const IsChapterExist = ($: CheerioStatic) => {
  return $(".txt-content").length < 1;
};
