import { NextFunction, Request, Response } from 'express';
import { FormatEnum } from '../services/images';

export const validateImageParams = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { filename, width, height, fit, flip, rotate, format } = req.query;

  const errors: string[] = [];

  if (!filename) errors.push('filename param is required.');

  if (width && isNaN(parseInt(width as string)))
    errors.push('width param must be a valid number');

  if (height && isNaN(parseInt(height as string)))
    errors.push('height must be a valid number');

  const fitKeys = ['cover', 'contain', 'fill', 'inside', 'outside'];
  if (fit && !fitKeys.includes(fit as string))
    errors.push(`invalid fit value. expected one of ${fitKeys}`);

  if (flip && !['true', 'false'].includes(flip as string))
    errors.push('flip must be boolean');

  if (rotate && isNaN(parseInt(rotate as string)))
    errors.push('rotate must be a a valid number');

  if (format && !((format as string) in FormatEnum))
    errors.push(
      `invalid format value. expected one of ${Object.keys(FormatEnum)}`,
    );

  if (errors.length > 0) {
    res.status(400).json({
      code: 400,
      message: 'Invalid Parameter',
      errors,
    });
    return;
  }

  next();
};
