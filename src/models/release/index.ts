import octokit, {
  ReposGetLatestReleaseResponseAssetsItem,
} from "@octokit/rest";
import fs from "fs";
import moment = require("moment");
import os from "os";
import path from "path";
import request = require("request");
import progress = require("request-progress");
import { log } from "winston";

import { WrapTMCT } from "../../apis/loggerWrapper";
import { COLORS } from "../../constants/color.const";
import { FormatFileSize } from "../../helpers/helper";

const owner = "kamontat";
const repo = "nd-js";

export interface InstallOption {
  bin: string;
}

export interface VersionObject {
  version: string;
  assets: Array<ReposGetLatestReleaseResponseAssetsItem>;
  url: string;
  date: string;
}

const GetOSName = () => {
  switch (os.platform()) {
    case "win32":
      return "win.exe";
    case "linux":
      return "linux";
    case "darwin":
      return "macos";
    default:
      return undefined;
  }
};

export const GetLatestVersion = async () => {
  const github = new octokit();
  github.authenticate({
    type: "token",
    token: process.env.GITHUB_TOKEN || "",
  });

  const result = await github.repos.getLatestRelease({ owner, repo });

  return {
    version: result.data.tag_name,
    assets: result.data.assets,
    url: result.data.html_url,
    date: result.data.published_at,
  } as VersionObject;
};

export const ListAllVersion = async () => {
  const github = new octokit();

  const result = await github.repos.listReleases({
    owner,
    repo,
    per_page: 100,
  });

  return result.data;
};

export const InstallVersion = (
  version: VersionObject,
  opts?: InstallOption,
) => {
  const defaultOptions = {
    bin: "/usr/local/bin",
  } as InstallOption;

  const options = {
    ...defaultOptions,
    ...opts,
  };

  const osName = GetOSName();
  if (!osName) {
    log(WrapTMCT("error", "Error", "Not support OS"));
    return;
  }

  const _asset = version.assets.filter(
    v => !v.name.includes("admin") && v.name.includes(osName || "undefined"),
  );
  if (_asset.length < 1) {
    log(WrapTMCT("error", "Error", "Binary file not found"));
    return;
  }
  const asset = _asset[0];

  const name = asset.name;
  const downloadURL = asset.browser_download_url;

  const dest = path.join(options.bin, "tmp", name);

  log(
    WrapTMCT(
      "info",
      "Installation",
      `Version ${COLORS.Important.color(version.version)} ${COLORS.Dim.color(
        version.date,
      )}`,
    ),
  );

  const size = FormatFileSize(asset.size);

  log(
    WrapTMCT(
      "info",
      "Binary",
      `Downloading ${COLORS.Name.color(name)} size=${size}`,
    ),
  );

  const width = process.stdout.columns || 80;
  const title = width * 0.25;
  const bar = width * 0.5;
  const footerSize = width * 0.25;

  console.log();
  progress(request(downloadURL))
    .on("progress", (state: any) => {
      const barSize = bar - 7;
      const percent = state.percent;

      const block = barSize * percent;

      const completed = "#";
      const incompleted = "-";

      const header = `${state.size.transferred}/${state.size.total}`.padEnd(
        title,
      );
      const progressbar = `[${""
        .padStart(block, completed)
        .padEnd(barSize, incompleted)}]`;

      const speed = `${FormatFileSize(state.speed)}/s`;
      const percentString = `${(percent.toFixed(2) * 100).toString()}%`.padEnd(
        3,
      );

      moment.locale("en");
      const time = moment.duration(state.time.remaining, "seconds");

      const footer = `${percentString}  ${speed}  ${time.humanize()}`.padEnd(
        footerSize,
      );

      process.stdout.write(`${header}${progressbar} ${footer} \x1b[0G`);
    })
    .on("end", function() {
      console.log("\n");
    })
    .on("error", function() {
      process.exit(5);
    })
    .pipe(fs.createWriteStream(dest));

  // const file = fs.createWriteStream(dest);
  // const request = https
  //   .get(downloadURL, function(response) {
  //     response.pipe(file);
  //   })
  //   .on("error", function(err) {
  //     if (err) fs.unlinkSync(dest);
  //   });

  // console.log(request);
};

export const InstallLatestVersion = (opts?: InstallOption) => {
  return GetLatestVersion().then(latest => {
    return InstallVersion(latest, opts);
  });
};
