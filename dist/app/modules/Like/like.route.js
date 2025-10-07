"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const like_validation_1 = require("./like.validation");
const like_controller_1 = require("./like.controller");
const router = (0, express_1.Router)();
router.post('/create-like', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.author, user_constant_1.USER_ROLE.user), (0, validateRequest_1.default)(like_validation_1.LikeValidation.createLikeValidationSchema), like_controller_1.LikeController.createToggleLikeIntoDB);
router.get('/:blogPostId/count', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.author, user_constant_1.USER_ROLE.user), like_controller_1.LikeController.getLikeCountFromDB);
exports.LikeRoutes = router;
