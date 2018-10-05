import { WrapTM } from "../../models/LoggerWrapper";
import { SeperateArgumentApi } from "../../helpers/action";
import { NovelBuilder } from "../../builder/novel";
import { log } from "winston";

export default (a: any) => {
  log(WrapTM("debug", "start command", "initial"));

  const { args } = SeperateArgumentApi(a);
  const location = args[0];

  NovelBuilder.buildLocal(location);
};
