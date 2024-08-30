"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/infrastructure/http/routes/UserRoutes.ts
const express_1 = require("express");
const UserService_1 = require("../../../domain/services/UserService");
const UserController_1 = require("../../../application/controllers/UserController");
const UserRepository_1 = require("../../../domain/repositories/UserRepository");
const connection_1 = __importDefault(require("../../database/connection"));
const UserRouter = (0, express_1.Router)();
const userRepository = new UserRepository_1.UserRepository(connection_1.default);
const userService = new UserService_1.UserService(userRepository);
const userController = new UserController_1.UserController(userService);
UserRouter.post('/createUser', (req, res) => userController.createUser(req, res));
exports.default = UserRouter;
