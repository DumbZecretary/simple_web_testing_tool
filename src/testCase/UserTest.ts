import { By, until } from "selenium-webdriver";
import Tool from "../../app/tool";

interface InputUserLogin {
  username: string;
  password: string;
}

export class UserTest {
  static async login(input: InputUserLogin) {
    await Tool.getInstance().test("login", async () => {
      const driver = Tool.getInstance().driver;
      await driver.findElement(By.id("username")).sendKeys(input.username);
      await driver.findElement(By.id("password")).sendKeys(input.password);
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.sleep(2000);
      await driver.findElement(By.className("ant-dropdown-trigger")).click();
    });
  }
}
