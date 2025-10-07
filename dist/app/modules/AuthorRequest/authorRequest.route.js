"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorRequestRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const authorRequest_validation_1 = require("./authorRequest.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const authorRequest_controller_1 = require("./authorRequest.controller");
const router = (0, express_1.Router)();
router.post('/crate-author-request', (0, auth_1.default)(user_constant_1.USER_ROLE.user), (0, validateRequest_1.default)(authorRequest_validation_1.AuthorRequestValidation.createAuthorRequestValidationSchema), authorRequest_controller_1.AuthorRequestController.createAuthorRequestIntoDB);
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), authorRequest_controller_1.AuthorRequestController.getAllAuthorRequestFromDB);
router.get('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.author), authorRequest_controller_1.AuthorRequestController.getSingleAuthorRequestFromDB);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), (0, validateRequest_1.default)(authorRequest_validation_1.AuthorRequestValidation.updateAuthorRequestValidationSchema), authorRequest_controller_1.AuthorRequestController.updateSingleAuthorRequestIntoDB);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.author, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.user), authorRequest_controller_1.AuthorRequestController.deletedAuthorRequestFromDB);
exports.AuthorRequestRoutes = router;
