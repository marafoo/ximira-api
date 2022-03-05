import express from 'express';

const app = express();

app.get('/', (request, response) => response.json({ server: true }));

app.listen(4000, () => console.log('Server listening on 4000'));
