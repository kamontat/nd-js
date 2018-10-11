import { SeperateArgumentApi } from "../../helpers/action";
import { NovelBuilder } from "../../builder/novel";

export default (a: any) => {
  const { args } = SeperateArgumentApi(a);
  const location = args[0];

  NovelBuilder.buildLocal(location);
};
