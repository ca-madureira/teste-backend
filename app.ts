require('dotenv').config();
import express from 'express';
import connectMongo from './utils/db';
import measureRoute from './routes/routes';

export const app = express();

app.use(express.json());

app.use('/api', measureRoute);

app.listen(process.env.PORT, () => {
  console.log('Servidor rodando');
  connectMongo();
});
