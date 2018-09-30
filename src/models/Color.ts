import { CONST_DEFAULT_COLORS, ColorHeader } from "../constants/color.const";
import { log } from "winston";
import { Chalk } from "chalk";
import { isMoment, isDate } from "moment";
import { resolve } from "path";
import { WrapTitleMessageColor, WrapTMC, WrapTM } from "./LoggerWrapper";
import { URL } from "url";
import { CheckIsNumber } from "../helpers/helper";

export class ColorType {
  name: string;

  _tranform: (v: any) => string;
  _color: Chalk;

  _alternative?: {
    color: Chalk;
    how: (v: any) => boolean;
  };

  constructor(
    name: string,
    color: Chalk,
    transform: (v: any) => string,
    alternativeColor?: Chalk,
    willUseAlternative?: (v: any) => boolean
  ) {
    this.name = name;
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
    if (!key) return CONST_DEFAULT_COLORS.Undefined;
    const result: ColorHeader[] = <ColorHeader[]>(
      Object.keys(CONST_DEFAULT_COLORS).filter(k => k.toLowerCase() === key.toLowerCase())
    );

    if (result.length < 1) return CONST_DEFAULT_COLORS.String;
    return CONST_DEFAULT_COLORS[result[0]];
  }

  static guess(obj: any): ColorType {
    if (!obj) return CONST_DEFAULT_COLORS.Undefined;
    if (isMoment(obj)) return CONST_DEFAULT_COLORS.Date;
    if (isDate(obj)) return CONST_DEFAULT_COLORS.Date;
    if (obj instanceof URL) return CONST_DEFAULT_COLORS.Link;
    if (obj instanceof Array) return CONST_DEFAULT_COLORS.ChapterList;
    // TODO: implement auto check path
    // log(WrapTM("debug", "resolve object", resolve(obj)));
    // if (resolve(obj) !== "") return CONST_DEFAULT_COLORS.Location;
    if (CheckIsNumber(obj.toString())) return CONST_DEFAULT_COLORS.Number;
    return CONST_DEFAULT_COLORS.String;
  }
}
