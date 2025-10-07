"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPostRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const blogPost_validation_1 = require("./blogPost.validation");
const blogPost_controller_1 = require("./blogPost.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const router = (0, express_1.Router)();
router.post('/create-blog-post', sendImageToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, auth_1.default)(user_constant_1.USER_ROLE.author, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(blogPost_validation_1.BlogPostValidation.createBlogPostZodSchema), blogPost_controller_1.BlogPostController.createBlogPostIntoDB);
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.author, user_constant_1.USER_ROLE.user), blogPost_controller_1.BlogPostController.getAllBlogPostFromDB);
router.get('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.author), blogPost_controller_1.BlogPostController.getSingleBlogPostFromDB);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.author), blogPost_controller_1.BlogPostController.updateSingleBlogPostIntoDB);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.author), blogPost_controller_1.BlogPostController.deleteSingleBlogPostFromDB);
exports.BlogPostRoutes = router;
