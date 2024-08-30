import express from 'express';
import UserRouter from './routes/UserRoutes';
import UploadRoutes from './routes/UploadRoutes';
import path from 'path';
import MeasurementRoutes from './routes/MeasurementRoutes'


const app = express();
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(express.json());

app.use('/api',UserRouter);

app.use('', UploadRoutes);

app.use('',MeasurementRoutes);

app.use('/images', express.static(path.join(__dirname, '..', '..', 'images')));

export default app;