import os from "os";

export const GetOSName = () => {
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
