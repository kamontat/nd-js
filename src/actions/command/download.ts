import { SeperateArgumentApi } from "../../helpers/action";
import { NovelBuilder } from "../../builder/novel";
import { Exception } from "../../models/Exception";
import { GetNID } from "../../helpers/novel";
import { Resource } from "../../models/Resource";

export default (a: any) => {
  const { options, args } = SeperateArgumentApi(a);

  const ids = args.map(arg => GetNID(arg));
  ids.forEach(id => {
    NovelBuilder.create(id)
      .then(novel => {
        novel.print();

        const resource = new Resource(novel);
        resource.save(options.force);

        // novel.save(options.force);
      })
      .catch(err => {
        const e: Exception = err;
        e.printAndExit();
      });
  });
};
