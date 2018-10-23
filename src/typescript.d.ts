declare function terminalLink(
  text: string,
  url: string,
  options?: { fallback: (text: string, url: string) => string }
): string;

declare module "terminal-link" {
  export = terminalLink;
}

declare function observable2Promise(obs: any): Promise<any>;

declare module "observable-to-promise" {
  export = observable2Promise;
}
