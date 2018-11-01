import { Moment } from "moment";
import Random from "random-js";

import { HistoryAction, HistoryNode } from "../HistoryNode";

export const RandomText = (size: number) => {
  return new Random(Random.engines.mt19937().autoSeed()).string(size);
};

export const RandomNode = (
  value: {
    action?: HistoryAction;
    title?: string;
    before?: string;
    after?: string;
    description?: string;
    time?: Moment;
  } = {},
) => {
  const rand = new Random(Random.engines.mt19937().autoSeed());

  const listAction = [HistoryAction.ADDED, HistoryAction.DELETED, HistoryAction.MODIFIED];
  if (!value.action) value.action = rand.pick(listAction);
  if (!value.title) value.title = RandomText(25);

  return new HistoryNode(
    value.action,
    value.title,
    { before: value.before, after: value.after },
    { description: value.description, time: value.time },
  );
};
