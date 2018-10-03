/**
 * @internal
 * @module nd.html
 */

export class HtmlNode {
  tag: string; // html tag support p, span, h1-h6
  style?: string; // css style
  text: string; // text

  constructor(build: { tag: string; style?: string; text: string }) {
    this.tag = build.tag;
    this.style = build.style;
    this.text = build.text;
  }

  build() {
    let style: string = "";
    if (this.style) style = ` style="${this.style}"`;
    return `<${this.tag}${style}> ${this.text} </${this.tag}>`;
  }
}
