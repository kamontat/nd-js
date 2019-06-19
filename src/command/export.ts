/**
 * @external
 * @module commander.command
 */
import puppeteer, { PDFOptions } from "puppeteer-core";
import { log } from "winston";

import { WrapTMC } from "../apis/loggerWrapper";
import { SeperateArgumentApi } from "../helpers/commander";

export default (a: any) => {
  const { options, args } = SeperateArgumentApi(a);

  log(WrapTMC("info", "Argument", args));

  // chrome 609904
  // check website: http://omahaproxy.appspot.com/

  (async () => {
    const browser = await puppeteer.launch({
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    });

    const page = await browser.newPage();

    await page.goto(`file://${args[0]}`, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    await page.emulateMedia("screen");
    await page.pdf({
      path: "example.pdf",
      format: "A4",
      displayHeaderFooter: true,
    });

    await browser.close();
  })();
};
