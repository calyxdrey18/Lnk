const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

let links = [];
const DATA_FILE = path.join(__dirname, 'links.json');

if (fs.existsSync(DATA_FILE)) {
  links = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

app.post('/submit', (req, res) => {
  const { groupName, groupLink } = req.body;
  if (groupLink && groupLink.includes('https://chat.whatsapp.com/')) {
    links.push({ groupName, groupLink });
    fs.writeFileSync(DATA_FILE, JSON.stringify(links, null, 2));
    res.sendStatus(200);
  } else {
    res.status(400).send('Invalid WhatsApp group link.');
  }
});

app.get('/links', (req, res) => {
  res.json(links);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
