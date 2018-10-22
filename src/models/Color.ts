/**
 * @internal
 * @module nd.color
 */

import { COLORS } from "../constants/color.const";
import { log } from "winston";
import { Chalk } from "chalk";
import { WrapTM } from "./LoggerWrapper";

/**
 * The type of message will effect the color of it.
 * This class created for auto parse to message to the type that they belong.
 *
 * @author Kamontat Chantrachirathumrong
 * @version 1.0.0
 * @since October 22, 2018
 */
export class ColorType {
  /**
   * This name of type
   */
  name: string;

  private _check: (v: any) => boolean;

  private _tranform: (v: any) => string;
  private _color: Chalk;

  private _alternative?: {
    color: Chalk;
    how: (v: any) => boolean;
  };

  /**
   * Create ColorType, usually this will create at const file
   * @param name name of color type
   * @param check The method for auto check is input is this type
   * @param color color of type
   * @param transform how to transform the result to string
   * @param alternativeColor alternative color
   * @param willUseAlternative the function that see that will use alternative color or not
   */
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

  /**
   * This will color the result instantly, with color or alternative color (if exist)
   * @param obj input message object
   */
  color(obj: any): string {
    if (this._alternative) return this._alternative.how(obj) ? this._alternative.color(obj) : this._color(obj);
    return this._color(obj);
  }

  /**
   * This will trancform the result before call {@link this.color} method.
   * @param obj input message object
   */
  formatColor(obj: any): string {
    if (!obj) return obj;
    const message = this._tranform(obj);
    if (this._alternative) return this._alternative.how(obj) ? this._alternative.color(message) : this._color(message);
    return this._color(message);
  }

  /**
   * This will guess the color base on {@link guess} method, and colorize it
   * @param message The message of the result
   */
  static colorize(message: any): string {
    const type = ColorType.guess(message);
    log(WrapTM("debug", "guess object", type.name));
    return type.formatColor(message);
  }

  /**
   * Parse the key name to ColorType
   * @param key ColorType name
   */
  static parse(key: string | undefined): ColorType {
    if (!key) return COLORS.Undefined;

    const colors: { [key: string]: ColorType } = COLORS;
    const result = Object.keys(colors)
      .map(k => colors[k])
      .filter(c => c.name.toLowerCase() === key.toLowerCase());
    if (result.length < 1) return COLORS.String;
    return result[0];
  }

  /**
   * This method will return ColorType base to the checking method and guess is it type
   * @param obj testing object
   *
   * @see {@link COLORS}
   */
  static guess(obj: any): ColorType {
    if (!obj) return COLORS.Undefined;

    const colors: { [key: string]: ColorType } = COLORS;
    const result = Object.keys(colors)
      .map(key => colors[key])
      .filter(color => color._check(obj))[0];

    if (result) return result;
    return COLORS.String;
  }
}
