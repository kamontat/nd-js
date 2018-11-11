/**
 * @internal
 * @module nd.html.api
 */

export const Query = ($: CheerioStatic, check: (c: Cheerio) => boolean, ...querys: string[]): Cheerio | undefined => {
  for (const query of Object.values(querys)) {
    const cheerio = $(query);
    if (check(cheerio)) {
      return cheerio;
    }
  }
  return;
};
