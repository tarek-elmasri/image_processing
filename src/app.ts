import express from 'express';
import router from './routes';

// initializing server
export const app = express();

app.use('/api', router);
app.all('*', (_, res) => res.status(404).send('no route found'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server started at port: ${PORT}`);
});
