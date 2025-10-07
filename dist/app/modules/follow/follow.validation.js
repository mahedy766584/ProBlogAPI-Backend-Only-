"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowValidation = exports.unFollowValidationSchema = exports.followValidationSchema = void 0;
const v3_1 = require("zod/v3");
const objectIdSchema_1 = require("../../utils/objectIdSchema");
exports.followValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        following: objectIdSchema_1.objectIdSchema
    })
});
exports.unFollowValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        following: objectIdSchema_1.objectIdSchema
    })
});
exports.FollowValidation = {
    followValidationSchema: exports.followValidationSchema,
    unFollowValidationSchema: exports.unFollowValidationSchema,
};
