"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/infrastructure/http/routes/MeasurementRoutes.ts
const express_1 = require("express");
const MeasurementController_1 = require("../../../application/controllers/MeasurementController");
const MeasurementSevice_1 = require("../../../domain/services/MeasurementSevice");
const Measurementrepository_1 = require("../../../domain/repositories/Measurementrepository");
const router = (0, express_1.Router)();
const measurementRepository = new Measurementrepository_1.MeasurementRepository();
const measurementService = new MeasurementSevice_1.MeasurementService(measurementRepository);
const measurementController = new MeasurementController_1.MeasurementController(measurementService);
router.patch('/confirm', (req, res) => measurementController.confirmMeasurement(req, res));
exports.default = router;
