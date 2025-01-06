const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

if (!fs.existsSync('uploads')) { // Create 'uploads' directory if it doesn't exist
  fs.mkdirSync('uploads');
}

app.use(express.static('public')); // Serve static files from 'public' directory

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads/'); // Save files in 'uploads' directory
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  }
});
const upload = multer({ storage });

// Route to handle file uploads (single or multiple)
app.post('/upload', upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send('No files uploaded.');
    }
    const fileNames = req.files.map(file => file.filename);
    res.send(`Files uploaded successfully: ${fileNames.join(', ')}`);
  } catch (error) {
    res.status(500).send('An error occurred while uploading the files.');
  }
});

const port = 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

module.exports = app; // Export for testing