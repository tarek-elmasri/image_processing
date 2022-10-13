import fs from 'fs';
import { FitEnum } from 'sharp';
import { Request, Response } from 'express';
import {
  generateInputPath,
  generateOutputPath,
  FormatEnum,
  ImageOptions,
  processImg,
} from '../../utils/images';

const getImage = async (req: Request, res: Response): Promise<void> => {
  try {
    // extracting supported query params
    const { filename, width, height, fit, flip, rotate, format } = req.query;

    //filter query params
    const imgOptions: ImageOptions = {
      width: parseInt(width as string) || undefined,
      height: parseInt(height as string) || undefined,
      fit: fit as keyof FitEnum,
      flip: flip === 'true',
      rotate: parseInt(rotate as string) || undefined,
      format: format as FormatEnum,
    };

    const fileLocation = generateInputPath(filename as string);
    const thumbLocation = generateOutputPath(filename as string, imgOptions);

    // return thumb if already exists
    const thumbExists = fs.existsSync(thumbLocation);
    if (thumbExists) {
      res.sendFile(thumbLocation);
      return;
    }

    // processing image
    const processedFile = await processImg(
      fileLocation,
      thumbLocation,
      imgOptions,
    );

    res.sendFile(processedFile);
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
