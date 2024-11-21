import fs from "fs";
import * as path from "path";

export interface DirectoryData {
  logDir: string;
  timestamp: string;
  newDir: string;
  logPath: string;
}

export class Utils {
  static createDirectory(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }

  static createLogDir(): DirectoryData {
    const logDir = "./log";
    const timestamp = Date.now().toString();
    const newDir = `${logDir}/${timestamp}`;
    const logPath = `${newDir}/step.txt`;

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }

    fs.mkdirSync(newDir);

    return {
      logDir,
      timestamp,
      newDir,
      logPath,
    };
  }

  static writeLog(message: string, filePath: string) {
    fs.writeFileSync(filePath, `${message}\n`, { flag: "a" });
  }

  static async takeScreenshot(driver: any, filePath: string, name: string) {
    await driver.takeScreenshot().then((image: any) => {
      fs.writeFileSync(path.join(filePath, `${name}.png`), image, "base64");
    });
  }
}
