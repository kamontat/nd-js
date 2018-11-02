/**
 * @internal
 * @module nd.color
 */

import { Chalk } from "chalk";
import { log } from "winston";

import { COLORS } from "../../constants/color.const";

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
  private _check: (v: any) => boolean;

  private _tranform: (v: any) => string;
  private _color: Chalk;

  private _alternative?: {
    color: Chalk;
    how(v: any): boolean;
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
  constructor(opt: {
    name: string;
    color: Chalk;
    alterColor?: Chalk;
    validator(v: any): boolean;
    transform(v: any): string;
    whenUseAlter?(v: any): boolean;
  }) {
    this.name = opt.name;
    this._check = opt.validator;
    this._color = opt.color;
    this._tranform = opt.transform;

    if (opt.alterColor && opt.whenUseAlter) {
      this._alternative = {
        color: opt.alterColor,
        how: opt.whenUseAlter,
      };
    }
  }
  /**
   * This name of type
   */
  public name: string;

  /**
   * This will color the result instantly, with color or alternative color (if exist)
   * @param obj input message object
   */
  public color(obj: any): string {
    if (this._alternative) {
      return this._alternative.how(obj) ? this._alternative.color(obj) : this._color(obj);
    }
    return this._color(obj);
  }

  /**
   * This will trancform the result before call {@link this.color} method.
   * @param obj input message object
   */
  public formatColor(obj: any): string {
    if (!obj) return obj;

    const message = this._tranform(obj);
    if (this._alternative) return this._alternative.how(obj) ? this._alternative.color(message) : this._color(message);
    return this._color(message);
  }

  /**
   * This will guess the color base on {@link guess} method, and colorize it
   * @param message The message of the result
   */
  public static colorize(message: any): string {
    const type = ColorType.guess(message);
    log(WrapTM("debug", "guess object", type.name));
    return type.formatColor(message);
  }

  /**
   * Parse the key name to ColorType
   * @param key ColorType name
   */
  public static parse(key: string | undefined): ColorType {
    if (!key) {
      return COLORS.Undefined;
    }

    const colors: { [key: string]: ColorType } = COLORS;
    const result = Object.keys(colors)
      .map(k => colors[k])
      .filter(c => c.name.toLowerCase() === key.toLowerCase());
    if (result.length < 1) {
      return COLORS.String;
    }
    return result[0];
  }

  /**
   * This method will return ColorType base to the checking method and guess is it type
   * @param obj testing object
   *
   * @see {@link COLORS}
   */
  public static guess(obj: any): ColorType {
    if (!obj) {
      return COLORS.Undefined;
    }

    const colors: { [key: string]: ColorType } = COLORS;
    const result = Object.keys(colors)
      .map(key => colors[key])
      .filter(color => color._check(obj))[0];

    if (result) {
      return result;
    }
    return COLORS.String;
  }
}
