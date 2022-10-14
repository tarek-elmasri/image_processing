import path from 'path';
import fs from 'fs';
import sharp, { FitEnum } from 'sharp';

// type for supported features
export type ImageOptions = {
  width?: number;
  height?: number;
  fit?: keyof FitEnum;
  flip?: boolean;
  rotate?: number;
  format?: FormatEnum;
};

// supported format
export enum FormatEnum {
  jpg = 'jpg',
  jpeg = 'jpeg',
  png = 'png',
}

// assets path
const ASSETS_PATH = path.join(__dirname, '../../assets/');

// locate file in local desk
export const generateInputPath = (filename: string): string => {
  const { name, ext } = path.parse(filename);
  return path.join(ASSETS_PATH, 'full_size/', `${name + (ext || '.jpg')}`);
};

// generate estimated thumb location
export const generateOutputPath = (
  filename: string,
  options: ImageOptions,
): string => {
  const { name, ext: inputExt } = path.parse(filename);
  const outputExt = options.format ? `.${options.format}` : inputExt || '.jpg';
  let outputName = `thumbs/thumb_${name}`;
  Object.keys(options).forEach((key: string) => {
    const value = options[key as keyof ImageOptions];
    if (key !== 'format' && Boolean(value)) {
      outputName += `_${key}_${value}`;
    }
  });
  return path.join(ASSETS_PATH, outputName + outputExt);
};

// checks if file exists
export const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
};

// creates thumbs folder if doesnt exists
export const ensureThumbDirExists = async (): Promise<string | undefined> => {
  const thumbFolder = path.normalize(ASSETS_PATH + 'thumbs');
  return fs.promises.mkdir(thumbFolder, { recursive: true });
};

// processing img with given options & return location for processed image
export const processImg = async (
  input: string,
  output: string,
  options: ImageOptions,
) => {
  const { width, height, fit, format, flip, rotate } = options;

  const img = sharp(input);
  if (format) img.toFormat(format);
  if (width || height) img.resize({ width, height, fit });
  if (rotate) img.rotate(rotate);
  if (flip) img.flip();

  await img.toFile(output);

  return output;
};

class ImageService {
  static Build = async (
    filename: string,
    options: ImageOptions,
  ): Promise<string> => {
    // generating path for both input and output
    const fileLocation = generateInputPath(filename);
    const thumbLocation = generateOutputPath(filename, options);

    // return thumb if already exists
    if (await fileExists(thumbLocation)) return thumbLocation;

    // ensure original image exists before processing
    if (!(await fileExists(fileLocation))) throw new Error('invalid filename');

    // create thumbs folder if didn't exists
    await ensureThumbDirExists();

    return processImg(fileLocation, thumbLocation, options);
  };
}

export default ImageService;
