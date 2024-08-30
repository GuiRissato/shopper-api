"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/infrastructure/http/routes/UploadRoutes.ts
const express_1 = require("express");
const UploadController_1 = require("../../../application/controllers/UploadController");
const GeminiApiService_1 = require("../../../domain/services/GeminiApiService");
const UserService_1 = require("../../../domain/services/UserService");
const UserRepository_1 = require("../../../domain/repositories/UserRepository");
const connection_1 = __importDefault(require("../../database/connection"));
const router = (0, express_1.Router)();
const userRepository = new UserRepository_1.UserRepository(connection_1.default);
const userService = new UserService_1.UserService(userRepository);
const geminiApiService = new GeminiApiService_1.GeminiApiService();
const uploadController = new UploadController_1.UploadController(geminiApiService, userService);
router.post('/upload', (req, res) => uploadController.uploadImage(req, res));
exports.default = router;
