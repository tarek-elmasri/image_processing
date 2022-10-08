import express from 'express';
import { getImage } from '../../controllers/imagesController';

const routes = express.Router();

routes.get('/', getImage);

export default routes;
