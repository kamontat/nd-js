/**
 * @internal
 * @module nd.novel.api
 */

import { WalkDirSync, CheckIsNovelPath } from "../helpers/helper";
import { ResourceBuilder } from "../builder/resource";

export class FileSearcher {
  public static SearchByNID(root: string, nid: string, max: number = 3) {
    const npath = WalkDirSync(root, max).filter(v => CheckIsNovelPath(v));
    return npath.filter(path => {
      const json = ResourceBuilder.Load(path);
      return json.novel.id === nid;
    });
  }
}
