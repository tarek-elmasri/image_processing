import express from 'express';
import imagesRouter from './api/imagesRouter';

const routes = express.Router();

routes.use('/images', imagesRouter);
export default routes;
