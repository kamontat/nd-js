/**
 * @internal
 * @module public.object
 */

/**
 * This is a option type of printer interface.
 */
export interface PrintOption {
  short?: boolean;
}

/**
 * The concept of the interface is, the class that able to interact with user must printable to show the result the user.
 * so that this will have only 2 method, which is format (format the class as string), print (print the result to stdout)
 *
 * @author Kamontat Chantrachirathumrong
 * @version 1.0.0
 * @since November 25, 2018
 */
export interface Printer {
  /**
   * Format the information of the class and return as string
   *
   * @param opt print option
   * @return formated string
   */
  format(opt?: PrintOption): string;

  /**
   * Print the format (format in this case, NOT necessary to use {@link format} method) to stdout.
   *
   * @param opt print option
   */
  print(opt?: PrintOption): void;
}
