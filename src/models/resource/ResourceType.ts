/**
 * @internal
 * @module nd.resource
 */

import { CommandResourceType } from "../CommandResource";
import { NovelResourceType } from "../NovelResource";

export interface ResourceObjectType {
  command: CommandResourceType;
  novel: NovelResourceType;
}
