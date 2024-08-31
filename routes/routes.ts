import express from 'express';
import {
  uploadMeasure,
  confirmMeasure,
  getMeasures,
  getLinkTemporary,
} from '../controllers/measure.controller';

const measureRoute = express.Router();

measureRoute.post('/upload', uploadMeasure);

measureRoute.patch('/confirm/:id', confirmMeasure);

measureRoute.get('/:id/list', getMeasures);

measureRoute.get('/upload/:id', getLinkTemporary);

export default measureRoute;
