import semver from "semver";

import { ListVersion } from "../security/index-admin";

export const checkPassword = (p: string) => {
  return `master-password-${ListVersion()[0]}` === p;
};

export const expireDateChoice = [
  { name: "3 hours", value: "3h" },
  { name: "5 hours", value: "5h" },
  { name: "10 hours", value: "10h" },
  { name: "1 day", value: "1d" },
  { name: "7 days", value: "7d" },
  { name: "30 days", value: "30d" },
  { name: "180 days", value: "180d" },
  { name: "1 year", value: "1y" },
];

export const notBeforeDateChoice = [
  { name: "now", value: "1ms" },
  { name: "1 hours", value: "1h" },
  { name: "5 hours", value: "5h" },
  { name: "10 hours", value: "10h" },
  { name: "1 day", value: "1d" },
];

export const versionChoice = (version: string) => {
  const major = semver.major(version);
  const minor = semver.major(version);
  const patch = semver.major(version);
  return [
    { name: "Every version", value: "*" },
    { name: `Allow update from ${major}.${minor}.0 to ${major}.${minor}.9`, value: `${major}.${minor}.x` },
    { name: `Allow update from ${major}.${minor}.${patch} to ${major}.${minor}.9`, value: `~${version}` },
    { name: `Allow update from ${major}.0.0 to ${major}.9.9`, value: `${major}.x.x` },
    { name: `Allow update from ${major}.${minor}.${patch} to ${major}.9.9`, value: `^${version}` },
  ];
};
