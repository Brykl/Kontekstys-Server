"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config/config"));
const dataBase_1 = require("./config/dataBase");
(0, dataBase_1.testConnection)();
app_1.default.listen(config_1.default.port, "172.30.0.66", () => {
    console.log(`Server running on http://172.30.0.66:${config_1.default.port}`);
});
