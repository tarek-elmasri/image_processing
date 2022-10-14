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
const assetsPath = path.join(__dirname, '../../assets/');

export const generateInputPath = (filename: string): string => {
  const { name, ext } = path.parse(filename);
  return path.join(assetsPath, 'full_size/', `${name + (ext || '.jpg')}`);
};

export const ensureThumbsFolderExists = () => {
  const thumbFolder = path.normalize(assetsPath + 'thumbs');
  fs.mkdirSync(thumbFolder, { recursive: true });
};

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
  return path.join(assetsPath, outputName + outputExt);
};

export const processImg = async (
  input: string,
  output: string,
  options: ImageOptions,
): Promise<string> => {
  const { width, height, fit, format, flip, rotate } = options;

  const img = sharp(input);

  if (format && !(format in FormatEnum))
    throw new Error(
      `Unsupported Format: ${format}. Expected one of ${Object.keys(
        FormatEnum,
      )}`,
    );

  if (format) img.toFormat(format);

  if (width || height) img.resize({ width, height, fit });

  if (rotate) img.rotate(rotate);

  if (flip) img.flip();

  await img.toFile(output);

  return output;
};

export default {
  assetsPath,
  processImg,
  generateInputPath,
  generateOutputPath,
};
