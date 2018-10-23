const express = require('express')
const app = express();
const cors = require('cors');
const port = 4000;

app.use(cors());

app.get('/', (req, res) => {
  console.log('Hello World!');
  res.send('Hello World!');
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));