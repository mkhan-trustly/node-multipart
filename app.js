const express = require('express');
const fs = require('fs');

const app = express();
const uploadMiddleware = require('./middlewares/uploadMiddleware');

app.use(express.static('public')); // Serve static files from 'public' directory

app.post('/upload', uploadMiddleware, (req, res) => {
    // Handle the uploaded files
    const { files } = req;

    // Process and store the files as required
    // For example, save the files to a specific directory using fs module
    files.forEach((file) => {
        const filePath = `uploads/${file.filename}`;
        fs.rename(file.path, filePath, (err) => {
            if (err) {
                // Handle error appropriately and send an error response
                return res.status(500).json({ error: 'Failed to store the file' });
            }
        });
    });

    const fileNames = files.map(file => file.filename);
    res.status(200).json({ message: `Files uploaded successfully: ${fileNames.join(', ')}` });
});

const port = 3000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

module.exports = app;