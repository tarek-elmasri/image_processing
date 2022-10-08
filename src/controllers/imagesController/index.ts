import { Request, Response } from 'express';

export const getImage = (req: Request, res: Response): void => {
  res.status(200).send('get image');
};
