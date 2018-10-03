import { SeperateArgumentApi } from "../../helpers/action";
import Config from "../../models/Config";

export default (a: any) => {
  const { options, args } = SeperateArgumentApi(a);

  // const config = Config.Load({ quiet: true });
  // console.log(config.getNovelLocation());

  // console.log(options);
  // console.log(args);
};
