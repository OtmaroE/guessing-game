const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8081;

app.use(express.static(path.join(__dirname, 'dist')));

console.log(path.join(__dirname, 'dist'))

app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});