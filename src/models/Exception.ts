export default class Exception extends Error {
  code: number = 1;
  constructor(title: string, shift?: number) {
    super(title);
    Error.captureStackTrace(this, this.constructor);

    if (shift) {
      this.code += shift;
    }
  }

  throw() {
    return this.stack;
  }

  exit() {
    process.exit(this.code);
  }
}

export class NotFoundException extends Exception {
  code = 10;
}

export class EmptyException extends Exception {
  code = 20;
}

export class WrongException extends Exception {
  code = 30;
}

export class FailException extends Exception {
  code = 40;
}
