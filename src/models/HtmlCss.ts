/**
 * @internal
 * @module nd.html
 */

export class CssTemplate {
  name: string;
  _css: string;

  constructor(name: string, cssObject: any) {
    this.name = name;

    const css = cssObject.toString();
    this._css = css;
  }

  getStyle() {
    return this._css;
  }
}
