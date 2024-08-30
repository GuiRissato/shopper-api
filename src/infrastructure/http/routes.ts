import express from 'express';
import UserRouter from './routes/UserRoutes';
import UploadRoutes from './routes/UploadRoutes';


const app = express();
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(express.json());

app.use('/api',UserRouter)

// Responsável por receber uma imagem em base 64, consultar o Gemini e retornar a medida lida pela API
app.use('', UploadRoutes);

// Responsável por confirmar ou corrigir o valor lido pelo LLM
app.patch('/confirm', (req, res)=> {

});

// Responsável por listar as medidas realizadas por um determinado cliente
app.get('/:customer_code/list', (req, res)=> {

});

export default app;