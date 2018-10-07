/**
 * @internal
 * @module nd.resource
 */

import { CommandResourceType } from "./CommandResource";
import { NovelResourceType } from "./NovelResource";

export type ResourceObjectType = {
  command: CommandResourceType;
  novel: NovelResourceType;
};
