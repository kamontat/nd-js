import { log } from "winston";

import { level, WrapTMC } from "../../apis/loggerWrapper";
import { COLORS } from "../../constants/color.const";

export const LINE = "--------------------- -->";

export const PrintHeader = (header: string, opts?: { level: level }) => {
  log(
    WrapTMC(
      (opts && opts.level) || "info",
      header,
      COLORS.Important.color(LINE),
    ),
  );
};
