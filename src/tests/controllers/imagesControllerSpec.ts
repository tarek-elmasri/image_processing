import supertest from 'supertest';
import { app } from '../../app';

const request = supertest(app);

describe('images controller methods', () => {
  it('get image endpoint to response with status 200 ok', async () => {
    const respone = await request.get('/api/images');
    expect(respone.status).toBe(200);
  });
});
