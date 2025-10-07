"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const follow_validation_1 = require("./follow.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const follow_controller_1 = require("./follow.controller");
const router = (0, express_1.Router)();
router.post('/create-follow', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.author, user_constant_1.USER_ROLE.user), (0, validateRequest_1.default)(follow_validation_1.FollowValidation.followValidationSchema), follow_controller_1.FollowController.createFollowUser);
router.post('/create-unfollow', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.author, user_constant_1.USER_ROLE.user), (0, validateRequest_1.default)(follow_validation_1.FollowValidation.unFollowValidationSchema), follow_controller_1.FollowController.createUnfollowUser);
router.get('/followers', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.author, user_constant_1.USER_ROLE.user), follow_controller_1.FollowController.getFollowersFromDB);
router.get('/following', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.author, user_constant_1.USER_ROLE.user), follow_controller_1.FollowController.getFollowingFromDB);
exports.FollowRoutes = router;
