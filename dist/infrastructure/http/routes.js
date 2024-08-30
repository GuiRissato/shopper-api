"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const UploadRoutes_1 = __importDefault(require("./routes/UploadRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: '20mb' }));
app.use(express_1.default.urlencoded({ limit: '20mb', extended: true }));
app.use(express_1.default.json());
app.use('/api', UserRoutes_1.default);
// Responsável por receber uma imagem em base 64, consultar o Gemini e retornar a medida lida pela API
app.use('', UploadRoutes_1.default);
// Responsável por confirmar ou corrigir o valor lido pelo LLM
app.patch('/confirm', (req, res) => {
});
// Responsável por listar as medidas realizadas por um determinado cliente
app.get('/:customer_code/list', (req, res) => {
});
exports.default = app;
