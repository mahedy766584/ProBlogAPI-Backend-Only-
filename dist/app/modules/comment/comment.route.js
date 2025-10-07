"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const comment_validation_1 = require("./comment.validation");
const comment_controller_1 = require("./comment.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = (0, express_1.Router)();
router.post('/create-comment', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.author, user_constant_1.USER_ROLE.user), (0, validateRequest_1.default)(comment_validation_1.CommentValidations.createCommentValidationSchema), comment_controller_1.CommentController.createCommentInPostIntoDB);
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.author, user_constant_1.USER_ROLE.user), comment_controller_1.CommentController.getAllCommentsFromDB);
router.get('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.author, user_constant_1.USER_ROLE.user), comment_controller_1.CommentController.getSingleCommentFromDB);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.author, user_constant_1.USER_ROLE.user), (0, validateRequest_1.default)(comment_validation_1.CommentValidations.updateCommentValidationSchema), comment_controller_1.CommentController.updateSingleCommentIntoDB);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.author, user_constant_1.USER_ROLE.user), comment_controller_1.CommentController.deleteSingleCommentFromDB);
exports.CommentRoutes = router;
