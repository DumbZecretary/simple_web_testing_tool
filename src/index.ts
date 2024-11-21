import { ConfigModel } from "../app/model/configModel";
import Tool from "../app/tool";
import * as TestCase from "./ExportTestCases";

var main = async () => {
  /// Luôn phải khởi tạo Tool trước khi thực hiện bất kỳ testing nào
  await Tool.getInstance().init(new ConfigModel("http://localhost:3000"));
  await Tool.getInstance().start();
  await TestCase.UserTest.login({
    username: "username",
    password: "password",
  });

  /// Luôn phải dispose Tool sau khi đã hoàn thành testing
  await Tool.getInstance().dispose();
};

main();
