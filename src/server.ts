import app from "./app";
import config from "./config/config";
import { testConnection } from "./config/dataBase";

testConnection();

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
