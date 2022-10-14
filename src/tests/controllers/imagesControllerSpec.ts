import supertest from 'supertest';
import { app } from '../../app';

const request = supertest(app);
const endpoint = '/api/images?';
const filename = 'fjord';
const filenameParams = `filename=${filename}`;
const validQueryParams = '&width=300&height=300&fit=fill&rotate=120&flip=true';
const invalidQueryParams = '&width=abc&height=abc&fit=abc&rotate=abc&flip=abc';

describe('testing api/images end point', () => {
  it('400 status when filename is missing with message', async () => {
    const res = await request.get(endpoint);
    expect(res.badRequest).toBeTrue();
    expect(res.text).toContain('message');
  });

  it('400 when fileame is invalid', async () => {
    const res = await request.get(endpoint + 'abc');
    expect(res.badRequest).toBeTrue();
    expect(res.text).toContain('message');
  });

  it("success when filename doesn't have extention", async () => {
    const res = await request.get(endpoint + filenameParams);
    expect(res.status).toBe(200);
  });

  it('success when filename have extention', async () => {
    const res = await request.get(endpoint + filenameParams + '.jpg');
    expect(res.status).toBe(200);
  });

  it('400 with message and errors when passing invalid parameters', async () => {
    const res = await request.get(
      endpoint + filenameParams + invalidQueryParams,
    );
    expect(res.status).toBe(400);
    expect(res.text).toContain('message');
    expect(res.text).toContain('errors');
  });

  it('200 when passing valid parameters', async () => {
    const res = await request.get(endpoint + filenameParams + validQueryParams);
    expect(res.status).toBe(200);
  });
});
