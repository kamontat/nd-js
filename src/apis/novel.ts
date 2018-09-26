import { NOVEL_LINK } from "../constants/novel.const";

import { log } from "winston";
import { WrapTM, WrapTMC } from "../models/LoggerWrapper";

import { NovelChapter, NovelBuilder } from "../models/Novel";
import { PassLink, GetChapter } from "../helpers/novel";

import { MakeHTML } from "./html";

import { HtmlNode } from "../models/Html";
import winston = require("winston");
import { BlackListText } from "../constants/htmlConst";
import { NovelError } from "../constants/error.const";

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

export const GetChapterName = (chapter: NovelChapter, $: CheerioStatic) => {
  let text = $("p#big_text").text();

  if (text !== "") {
    chapter.setName(text);
    return chapter;
  }

  text = $(".head1").text();
  if (text !== "") {
    chapter.setName(text);
    return chapter;
  }

  throw NovelError.clone().loadString("Cannot get chapter name");
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
          if (BlackListText.filter(v => text.includes(v)).length < 1) {
            // log(WrapTMC("debug", "Content", text));
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
            log(WrapTMC("debug", "Content", text));
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
