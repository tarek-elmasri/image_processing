import path from 'path';
import fs from 'fs';
import {
  generateOutputPath,
  generateInputPath,
  FormatEnum,
  processImg,
} from '../../utils/images';
import sharp from 'sharp';

describe('images utils functionalities', () => {
  const assetsPath = path.join(__dirname, '../../../assets/');
  const filename = 'fjord';
  describe('createInputPath function', () => {
    it('provided with filename without extenstion to return referal to original image path with jpg extenstion', () => {
      expect(generateInputPath(filename)).toBe(
        path.normalize(assetsPath + `full_size/${filename}.jpg`),
      );
    });

    it('provided with filename with extention to return referal to original image path with extention', () => {
      expect(generateInputPath('image.png')).toBe(
        path.normalize(assetsPath + 'full_size/image.png'),
      );
    });
  });

  describe('generateOutputPath to return path for estimated thumb filename including options', () => {
    it('filename without extention', () => {
      expect(generateOutputPath('image', {})).toEqual(
        path.normalize(assetsPath + '/thumbs/thumb_image.jpg'),
      );
    });

    it('filename with extention and no format option', () => {
      expect(generateOutputPath('image.png', {})).toEqual(
        path.normalize(assetsPath + '/thumbs/thumb_image.png'),
      );
    });

    it('filename with extention and format option', () => {
      expect(
        generateOutputPath('image.mng', { format: FormatEnum.jpg }),
      ).toEqual(path.normalize(assetsPath + '/thumbs/thumb_image.jpg'));
    });

    it('filename with all provided options', () => {
      expect(
        generateOutputPath('image.png', {
          width: 100,
          height: 100,
          fit: 'contain',
          rotate: 50,
          flip: true,
          format: FormatEnum.jpg,
        }),
      ).toEqual(
        path.normalize(
          assetsPath +
            '/thumbs/thumb_image_width_100_height_100_fit_contain_rotate_50_flip_true.jpg',
        ),
      );
    });
  });

  describe('processImg method', () => {
    const inputPath = path.join(assetsPath, 'full_size/' + filename + '.jpg');
    const thumbsPath = path.join(assetsPath, 'thumbs/');
    it('throw error when format is unsupported', async () => {
      const outputPath = path.join(thumbsPath, 'thumb_image.www');
      await expectAsync(
        processImg(inputPath, outputPath, { format: 'pngg' as FormatEnum }),
      ).toBeRejected();
    });

    it('file is created successfully on desk to provided output path', async () => {
      const outputPath = path.join(
        thumbsPath,
        `thumb_${filename}_width_100.jpg`,
      );
      await processImg(inputPath, outputPath, { width: 100 });
      expect(fs.existsSync(outputPath)).toBeTrue();
    });

    it('thumb is resized with provided width, height and format params', async () => {
      const outputPath = path.join(
        thumbsPath,
        `thumb_${filename}_width_600_height_700.png`,
      );

      const thumb = await processImg(inputPath, outputPath, {
        width: 600,
        height: 700,
        format: FormatEnum.png,
      });
      const newFileMetadata = await sharp(thumb).metadata();
      expect(newFileMetadata.width).toEqual(600);
      expect(newFileMetadata.height).toEqual(700);
      expect(newFileMetadata.format).toEqual('png');
    });
  });
});
