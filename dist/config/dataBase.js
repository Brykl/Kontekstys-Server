"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = void 0;
const pg_1 = require("pg");
const config_1 = __importDefault(require("./config"));
const pool = new pg_1.Pool({
    host: config_1.default.dbHost,
    port: config_1.default.dbPort,
    user: config_1.default.dbUser,
    password: config_1.default.dbPassword,
    database: config_1.default.dbName,
});
const testConnection = async () => {
    try {
        const res = await pool.query("SELECT NOW()");
        console.log("Connected to PostgreSQL. Server time:", res.rows[0].now);
    }
    catch (error) {
        console.error("Failed to connect to PostgreSQL:", error);
    }
};
exports.testConnection = testConnection;
exports.default = pool;
