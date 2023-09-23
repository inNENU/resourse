import { config } from "dotenv";
import { client, putFolder } from "ftp-hope";

config();

// 连接客户端
client.connect({
  host: "mp.innenu.com",
  user: process.env.FTP_USERNAME,
  password: process.env.FTP_PASSWORD,
});

client.on("ready", () => {
  putFolder("./service/info").then(() => {
    console.log("upload success");
    client.end();
  });
});
