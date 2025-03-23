const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

//signatures directory exists//
const signaturesDir = path.join(__dirname, 'signatures');
if (!fs.existsSync(signaturesDir)) {
  fs.mkdirSync(signaturesDir);
}

//save the signature//
app.post('/save-signature', (req, res) => {
  const { signature } = req.body;
  if (!signature) {
    return res.status(400).send('Signature data is required');
  }
  const buffer = Buffer.from(signature, 'base64');
  const filename = crypto.randomBytes(16).toString('hex') + '.png';
  const filePath = path.join(signaturesDir, filename);

  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      return res.status(500).send('Error saving the signature');
    }
    res.status(200).send('Signature saved successfully');
  });
});

//retrieve saved signatures//
app.get('/signatures', (req, res) => {
  fs.readdir(signaturesDir, (err, files) => {
    if (err) {
      return res.status(500).send('Error retrieving signatures');
    }
    res.status(200).json(files);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
