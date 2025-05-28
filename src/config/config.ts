import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;

  dbHost: string;
  dbPort: number;
  dbUser: string;
  dbPassword: string;
  dbName: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",

  dbHost: process.env.PG_HOST || "localhost",
  dbPort: Number(process.env.PG_PORT) || 5432,
  dbUser: process.env.PG_USER || "postgres",
  dbPassword: process.env.PG_PASSWORD || "",
  dbName: process.env.PG_DATABASE || "postgres",
};

export default config;
