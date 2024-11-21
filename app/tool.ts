import { Browser, Builder, WebDriver } from "selenium-webdriver";
import { DirectoryData, Utils } from "./utils";
import { ConfigModel } from "./model/configModel";

class Tool {
  private static instance: Tool;

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): Tool {
    if (!Tool.instance) {
      Tool.instance = new Tool();
    }
    return Tool.instance;
  }

  public async init(
    config: ConfigModel = new ConfigModel("http://localhost:3000")
  ) {
    const builder = new Builder();
    this._driver = await builder.forBrowser(Browser.CHROME).build();
    this.dir = Utils.createLogDir();
    this.config = config;
  }

  public async start() {
    await this._driver?.get(this.config?.url ?? "");
    await this._driver?.sleep(3000);
  }

  public async dispose() {
    await this._driver?.quit();
    this.writeResults();
  }

  async test(key: string, fn: () => Promise<void>): Promise<void> {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    try {
      const result = await fn();
      this.cache.set(key, `passed`);
      return result;
    } catch (error) {
      if (this.dir?.logPath == undefined) {
        return;
      }
      const screenshotDir = `${this.dir?.newDir}/errorImages`;
      Utils.createDirectory(screenshotDir);
      await Utils.takeScreenshot(this._driver, screenshotDir, key);
      Utils.writeLog(
        `key: ${key} \n\t\t ERROR: ${error}\n\n`,
        this.dir?.logPath
      );
    }
  }

  writeResults() {
    if (this.dir?.logPath == undefined) {
      return;
    }

    let result = "";
    this.cache.forEach((value, key) => {
      result += `${key}: ${value}\n`;
    });

    Utils.writeLog(`\n${result}`, this.dir?.logPath);
  }

  clearCache(): void {
    this.cache.clear();
  }

  deleteFromCache(key: string): void {
    this.cache.delete(key);
  }

  get driver(): WebDriver {
    if (this._driver == undefined) {
      throw new Error("Driver is not defined");
    }
    return this._driver;
  }

  private _driver: WebDriver | undefined;
  dir: DirectoryData | undefined;

  private config: ConfigModel | undefined;

  private cache: Map<string, any>;
}

export default Tool;
