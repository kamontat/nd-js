export default interface Throwable extends Error {
  throw(): string;
  exit(): void;

  loadError(e: Error): Exception;
  loadString(e: string): Exception;

  clone(): Exception;
}

export class Exception extends Error implements Throwable {
  code: number = 1;
  description: string = "";
  constructor(title: string, shift?: number) {
    super(title);
    Error.captureStackTrace(this, this.constructor);

    if (shift) {
      this.code += shift;
    }
  }

  throw = () => {
    let m = `${this.message} ${this.description}`;
    this.description = "";
    return m;
  };

  exit = () => {
    process.exit(this.code);
  };

  loadError = (e: Error) => {
    this.description = `cause by "${e.message}"`;
    return this;
  };

  loadString = (message: string) => {
    this.description = `cause by "${message}"`;
    return this;
  };

  clone = (): Exception => {
    return this;
  };
}

/**
 * NFError is not found error
 */
export class NFError extends Exception {
  code = 10;

  clone = (): Exception => {
    let n = new NFError(this.message);
    n.code = this.code;
    return n;
  };
}

/**
 * EError is error or wrong input
 */
export class EError extends Exception {
  code = 20;

  clone = (): Exception => {
    let n = new EError(this.message);
    n.code = this.code;
    return n;
  };
}

/**
 * FError is fail to do something
 */
export class FError extends Exception {
  code = 40;

  clone = (): Exception => {
    let n = new FError(this.message);
    n.code = this.code;
    return n;
  };
}
