import path from 'path';
import ImageService, {
  generateOutputPath,
  generateInputPath,
  FormatEnum,
  processImg,
} from '../../services/images';
import sharp from 'sharp';

const assetsPath = path.join(__dirname, '../../../assets/');
const filename = 'fjord';

describe('image service utils', () => {
  describe('createInputPath function to return path for the original image', () => {
    it('filename without extenstion', () => {
      expect(generateInputPath(filename)).toBe(
        path.normalize(assetsPath + `full_size/${filename}.jpg`),
      );
    });

    it('filename with extention', () => {
      expect(generateInputPath(filename + '.png')).toBe(
        path.normalize(assetsPath + 'full_size/' + filename + '.png'),
      );
    });
  });

  describe('generateOutputPath to return path for estimated thumb filename including options', () => {
    it('filename without extention', () => {
      expect(generateOutputPath(filename, {})).toEqual(
        path.normalize(assetsPath + '/thumbs/thumb_' + filename + '.jpg'),
      );
    });

    it('filename with extention and no format option', () => {
      expect(generateOutputPath(filename + '.png', {})).toEqual(
        path.normalize(assetsPath + '/thumbs/thumb_' + filename + '.png'),
      );
    });

    it('filename with extention and format option', () => {
      expect(
        generateOutputPath(filename + '.mng', { format: FormatEnum.jpg }),
      ).toEqual(
        path.normalize(assetsPath + '/thumbs/thumb_' + filename + '.jpg'),
      );
    });

    it('filename with all provided options', () => {
      expect(
        generateOutputPath(filename, {
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
            '/thumbs/thumb_' +
            filename +
            '_width_100_height_100_fit_contain_rotate_50_flip_true.jpg',
        ),
      );
    });
  });

  describe('processImg method', () => {
    const inputPath = path.join(assetsPath, 'full_size/' + filename + '.jpg');
    const thumbsPath = path.join(assetsPath, 'thumbs/');

    it('thumb is processed and resized with provided width, height and format params', async () => {
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

    it('processImg to throw error when filename is invalid', async () => {
      const input = path.join(assetsPath, 'full_size/abc.jpg');
      const output = path.join(thumbsPath, `thumb_abc.jpg`);

      await expectAsync(processImg(input, output, {})).toBeRejectedWithError();
    });
  });

  describe('Image service static build method', async () => {
    it('to return path to thumb whether it already exists or been created.', async () => {
      const output = path.join(
        assetsPath + 'thumbs/thumb_' + filename + '.jpg',
      );
      const service = await ImageService.Build(filename, {});
      expect(service).toEqual(output);
    });

    it('to throw error when filename is invalid', async () => {
      await expectAsync(ImageService.Build('abc', {})).toBeRejectedWithError();
    });
  });
});
