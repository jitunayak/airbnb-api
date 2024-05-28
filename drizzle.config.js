"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.dev.vars' });
exports.default = {
    schema: './src/db/schema.ts',
    out: './drizzle/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
    verbose: true,
    strict: true,
};
