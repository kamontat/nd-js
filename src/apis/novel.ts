import { log } from "winston";
import { NovelChapter, NovelBuilder } from "../models/Novel";
import { PassLink, GetChapter } from "../helpers/novel";
import { NOVEL_LINK } from "../constants/novel.const";
import { WrapTM, WrapTMC } from "../models/LoggerWrapper";
import { MakeHTML, HtmlNode } from "./html";

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

export const GetNovelContent = ($: CheerioStatic) => {
  let result: HtmlNode[] = [];

  // TODO: This way is for novel version 1 only
  $("table#story_body")
    .children()
    .children()
    .children()
    .contents()
    .each(function(i, e) {
      let query = $(e);

      if (query.html() === "" || query.html() === null) {
        if (query.text() !== "" && query.text() !== "\n") {
          log(WrapTMC("debug", `Element(${i})`, query.text()));
        }
      }
    });

  return MakeHTML(result);
};
