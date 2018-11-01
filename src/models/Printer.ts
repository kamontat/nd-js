export type PrintOption = { short?: boolean };

export interface Printer {
  format(opt?: PrintOption): string;
  print(opt?: PrintOption): void;
}
