/**
 * @internal
 * @module nd.resource.model.builder
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

  public static Load(location: string) {
    const resource = new Resource();
    return resource.loadLocation(location);
  }
}
