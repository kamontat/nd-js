/**
 * @internal
 * @module nd.color
 */

import { COLORS } from "../constants/color.const";
import { log } from "winston";
import { Chalk } from "chalk";
import { WrapTMC } from "./LoggerWrapper";

/**
 * The type of message will effect the color of it.
 * This class created for auto parse to message to the type that they belong.
 */
export class ColorType {
  name: string;

  _check: (v: any) => boolean;

  _tranform: (v: any) => string;
  _color: Chalk;

  _alternative?: {
    color: Chalk;
    how: (v: any) => boolean;
  };

  constructor(
    name: string,
    check: (v: any) => boolean,
    color: Chalk,
    transform: (v: any) => string,
    alternativeColor?: Chalk,
    willUseAlternative?: (v: any) => boolean
  ) {
    this.name = name;
    this._check = check;
    this._color = color;
    this._tranform = transform;

    if (alternativeColor && willUseAlternative) {
      this._alternative = {
        color: alternativeColor,
        how: willUseAlternative
      };
    }
  }

  color(obj: any): string {
    if (this._alternative) return this._alternative.how(obj) ? this._alternative.color(obj) : this._color(obj);
    return this._color(obj);
  }

  formatColor(obj: any): string {
    if (!obj) return obj;
    const message = this._tranform(obj);
    if (this._alternative) return this._alternative.how(obj) ? this._alternative.color(message) : this._color(message);
    return this._color(message);
  }

  static colorize(message: any): string {
    const type = ColorType.guess(message);
    log(WrapTMC("debug", "guess object", type.name));
    return type.formatColor(message);
  }

  static parse(key: string | undefined): ColorType {
    if (!key) return COLORS.Undefined;

    const colors: { [key: string]: ColorType } = COLORS;
    const result = Object.keys(colors)
      .map(k => colors[k])
      .filter(c => c.name.toLowerCase() === key.toLowerCase());
    if (result.length < 1) return COLORS.String;
    return result[0];
  }

  static guess(obj: any): ColorType {
    if (!obj) return COLORS.Undefined;

    const colors: { [key: string]: ColorType } = COLORS;
    const result = Object.keys(colors)
      .map(key => colors[key])
      .filter(color => color._check(obj))[0];

    if (result) return result;
    return COLORS.String;

    // TODO: implement auto check path
    // log(WrapTM("debug", "resolve object", resolve(obj)));
    // if (resolve(obj) !== "") return CONST_DEFAULT_COLORS.Location;
  }
}
