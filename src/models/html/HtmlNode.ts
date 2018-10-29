/**
 * @internal
 * @module nd.html
 */

export class HtmlNode {

  constructor(build: { tag: string; style?: string; text: string }) {
    this.tag = build.tag;
    this.style = build.style;
    this.text = build.text;
  }
  public tag: string; // html tag support p, span, h1-h6
  public style?: string; // css style
  public text: string; // text

  public build() {
    let style: string = "";
    if (this.style) style = ` style="${this.style}"`;
    return `<${this.tag}${style}> ${this.text} </${this.tag}>`;
  }
}
