import app from "./app";
import config from "./config/config";
import { testConnection } from "./config/dataBase";
const a = "localhost";
testConnection();

app.listen(config.port, a, () => {
  console.log(`Server running on http://${a}:${config.port}`);
});
