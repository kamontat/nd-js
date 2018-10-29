/**
 * @internal
 * @module nd.html
 */

export class CssTemplate {

  constructor(name: string, cssObject: any) {
    this.name = name;

    const css = cssObject.toString();
    this._css = css;
  }
  public name: string;
  public _css: string;

  public getStyle() {
    return this._css;
  }
}
