"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const bookmark_validation_1 = require("./bookmark.validation");
const bookmark_controller_1 = require("./bookmark.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = (0, express_1.Router)();
router.post('/create-bookmark', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.author, user_constant_1.USER_ROLE.user), (0, validateRequest_1.default)(bookmark_validation_1.BookMarkValidation.createBookMarkSchemaValidation), bookmark_controller_1.BookMarkController.createBookMarkIntoDB);
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), bookmark_controller_1.BookMarkController.getAllBookmarkFromDB);
router.get('/:id/bookmark', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.author, user_constant_1.USER_ROLE.user), bookmark_controller_1.BookMarkController.getForUserBookmark);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.author, user_constant_1.USER_ROLE.user), bookmark_controller_1.BookMarkController.deleteBookmarkFromDB);
exports.BookmarkRoutes = router;
