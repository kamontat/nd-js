declare function terminalLink(
  text: string,
  url: string,
  options?: { fallback: (text: string, url: string) => string }
): string;

declare module "terminal-link" {
  export = terminalLink;
}
