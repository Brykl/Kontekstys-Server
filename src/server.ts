import app from "./app";
import config from "./config/config";
import { testConnection } from "./config/dataBase";

testConnection();

app.listen(config.port, "172.30.253.7", () => {
  console.log(`Server running on http://172.30.253.7:${config.port}`);
});
