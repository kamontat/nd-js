/**
 * @internal
 * @module nd.resource.builder
 */

import { Novel } from "../models/novel/Novel";
import { Resource } from "../models/resource/Resource";

export class ResourceBuilder {
  public static Create(novel: Novel) {
    const res = new Resource();
    res.loadNovel(novel);
    res.loadHistory(novel.history());
    return res;
  }
}
