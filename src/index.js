/*const express = require('express');
const app = express();
const port = 3000

app.use('/', express.static(__dirname + '/'));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});*/
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
