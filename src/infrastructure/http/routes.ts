import express from 'express';
import { UserController } from '../../application/controllers/UserController';

const app = express();
app.use(express.json());

const userController = new UserController();

app.post('/users', (req, res) => userController.createUser(req, res));

// Responsável por receber uma imagem em base 64, consultar o Gemini e retornar a medida lida pela API
app.post('/upload', (req, res)=> {});

// Responsável por confirmar ou corrigir o valor lido pelo LLM
app.post('/confirm', (req, res)=> {});

// Responsável por listar as medidas realizadas por um determinado cliente
app.get('/:customer_code/list', (req, res)=> {});

export default app;