"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectIdSchema = void 0;
const v3_1 = __importDefault(require("zod/v3"));
// Regular expression to roughly validate MongoDB ObjectId (24-hex characters)
exports.objectIdSchema = v3_1.default
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "ID must be a valid DB ObjectId")
    .nonempty("ID is required");
