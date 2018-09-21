import { URL } from "url";
import { verbose } from "winston";

export const DownloadAPI = (url: URL) => {
  verbose("start download from " + url);
};
