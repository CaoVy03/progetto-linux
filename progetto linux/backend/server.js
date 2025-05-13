const express = require('express');
const app = express();
const port = 3000;


app.get('/', (req, res) => {
  res.send('hello api');
});


app.get('/api', (req, res) => {
  res.json({ message: 'hello api' });
});


app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
