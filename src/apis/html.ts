/**
 * @internal
 * @module nd.apis
 */

export const Query = ($: CheerioStatic, check: (c: Cheerio) => boolean, ...querys: string[]): Cheerio | undefined => {
  for (let q in querys) {
    let query = $(querys[q]);
    if (check(query)) return query;
  }
  return undefined;
};
