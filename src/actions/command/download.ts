import { log } from "winston";
import { SeperateArgumentApi } from "../../helpers/action";
import { NovelBuilder } from "../../models/Novel";
import { WrapTMC } from "../../models/LoggerWrapper";
import { Exception } from "../../models/Exception";

export default (a: any) => {
  const { options, args } = SeperateArgumentApi(a);

  const id = args[0]; // TODO: make support in multiple id

  NovelBuilder.create(id)
    .then(novel => {
      novel.print();
      novel.save(options.force);
    })
    .catch(err => {
      const e: Exception = err;
      e.printAndExit();
    });
};
