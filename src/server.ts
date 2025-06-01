import app from "./app";
import config from "./config/config";
import { testConnection } from "./config/dataBase";

testConnection();

app.listen(config.port, "localhost", () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
