import { URL } from "url";
import { verbose } from "winston";

// TODO: make download using axios library
export const DownloadAPI = (url: URL) => {
  verbose("start download from " + url);
};

// TODO: Add multiple thread downloader https://github.com/tusharmath/Multi-threaded-downloader

// TODO: Add progressbar https://github.com/visionmedia/node-progress
