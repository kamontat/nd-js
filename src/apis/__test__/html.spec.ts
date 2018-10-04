import "jest-extended";

import { load } from "cheerio";

import { Query } from "../html";

const mockHtml = `<div>
<div class="world">
  <span>Good bye</span>
</div>
<div class="next">
  <p class="hello">
    Hello world
  </p>
</div>
</div>`;

test("Should try the query", function() {
  const $ = load(mockHtml);

  const hello = Query($, c => c.hasClass("hello"), "div", "p");
  if (hello) expect(hello.text()).toInclude("Hello world");
});

test("Should try another query", function() {
  const $ = load(mockHtml);

  const result = Query($, c => c.text() != null, "span");
  if (result) expect(result.text()).toInclude("Good bye");
});

test("Should return undefined if not exist", function() {
  const $ = load(mockHtml);

  const result = Query($, c => c.hasClass("nothing"), ".noway", "span", "div");
  expect(result).toBeUndefined();
});
