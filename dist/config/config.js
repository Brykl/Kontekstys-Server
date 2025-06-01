"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    dbHost: process.env.PG_HOST || "localhost",
    dbPort: Number(process.env.PG_PORT) || 5432,
    dbUser: process.env.PG_USER || "postgres",
    dbPassword: process.env.PG_PASSWORD || "",
    dbName: process.env.PG_DATABASE || "postgres",
    secretToken: process.env.SECRET_TOKEN || "secret_token_null",
};
exports.default = config;
