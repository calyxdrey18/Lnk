const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 3000;

const upload = multer({ dest: 'public/uploads/' });
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

let links = [];
const DATA_FILE = path.join(__dirname, 'links.json');

if (fs.existsSync(DATA_FILE)) {
  links = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

app.post('/submit', upload.single('groupImage'), (req, res) => {
  const { username, groupName, groupLink } = req.body;
  if (!username || username.trim() === '') return res.status(400).send('Username is required.');
  if (!groupName || groupName.trim() === '') return res.status(400).send('Group name is required.');
  if (!groupLink || !groupLink.includes('https://chat.whatsapp.com/')) return res.status(400).send('Invalid WhatsApp group link.');

  let imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  links.push({ username: username.trim(), groupName: groupName.trim(), groupLink: groupLink.trim(), imagePath });
  fs.writeFileSync(DATA_FILE, JSON.stringify(links, null, 2));
  res.sendStatus(200);
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


