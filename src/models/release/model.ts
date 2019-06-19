import { ReposGetLatestReleaseResponseAssetsItem } from "@octokit/rest";

export interface InstallOption {
  bin: string;
}

export interface VersionObject {
  version: string;
  assets: Array<ReposGetLatestReleaseResponseAssetsItem>;
  url: string;
  date: string;
}
