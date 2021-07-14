import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('oh yeah 2!!!!')
});

export default app;
