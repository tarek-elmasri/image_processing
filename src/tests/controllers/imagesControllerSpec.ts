import fs from 'fs';
import supertest from 'supertest';
import { app } from '../../app';
import { generateOutputPath } from '../../utils/images';

describe('get api/images endpoint', () => {
  const request = supertest(app);
  const endpoint = '/api/images?';
  const filename = 'fjord';
  const filenameParams = 'filename=' + filename;

  it('400 status when filename param is missing', async () => {
    const res = await request.get(endpoint);
    expect(res.status).toBe(400);
  });

  it('400 when passing invalid filename', async () => {
    const res = await request.get(endpoint + 'filename=test');
    expect(res.status).toBe(400);
  });

  it('200 with valid filename params', async () => {
    const res = await request.get(endpoint + filenameParams);
    expect(res.status).toBe(200);
  });

  it('400 status when passing invalid resize fit params', async () => {
    const res = await request.get(
      endpoint + filenameParams + '?width=100&height=100&fit=test',
    );
    expect(res.status).toBe(400);
  });

  it('200 with valid resize fit params', async () => {
    const res = await request.get(
      endpoint + filenameParams + '&width=200&height=200&fit=contain',
    );
    expect(res.status).toBe(200);
  });

  it('200 with valid flip and rotate params', async () => {
    const res = await request.get(
      endpoint + filenameParams + '&flip=true&rotate=70',
    );
    expect(res.status).toBe(200);
  });

  it('thumb is created successfully on disk', async () => {
    const queryParam = filenameParams + '&width=600&height=300';
    await request.get(endpoint + queryParam);
    const thumbPath = generateOutputPath(filename, { width: 600, height: 300 });
    expect(fs.existsSync(thumbPath)).toBeTrue();
  });

  it('400 with unsupported format params', async () => {
    const queryParam = 'filename=image&format=www';
    const res = await request.get(endpoint + queryParam);
    expect(res.status).toBe(400);
  });

  it('200 with supported format params', async () => {
    const queryParam = filenameParams + '&format=png';
    const res = await request.get(endpoint + queryParam);
    expect(res.status).toBe(200);
  });
});
