import express from 'express';
import { getImage } from '../../controllers/imagesController';
import { validateImageParams } from '../../middlewares/params_validator';

const routes = express.Router();

routes.get('/', validateImageParams, getImage);

export default routes;
