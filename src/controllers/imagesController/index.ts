import { Request, Response } from 'express';
import { FitEnum } from 'sharp';
import ImageService, { FormatEnum, ImageOptions } from '../../services/images';

const getImage = async (req: Request, res: Response): Promise<void> => {
  try {
    // extracting supported query params
    const { filename, width, height, fit, flip, rotate, format } = req.query;

    // filter query params
    const imgOptions: ImageOptions = {
      width: parseInt(width as string) || undefined,
      height: parseInt(height as string) || undefined,
      fit: fit as keyof FitEnum,
      flip: flip === 'true',
      rotate: parseInt(rotate as string) || undefined,
      format: format as FormatEnum,
    };

    // processing image
    const thumb = await ImageService.Build(filename as string, imgOptions);

    res.sendFile(thumb);
  } catch (error) {
    // catch processing errors
    res.status(400).json({
      code: 400,
      message:
        error instanceof Error
          ? error.message
          : 'Error occured during proccessing image.',
    });
  }
};

export { getImage };
