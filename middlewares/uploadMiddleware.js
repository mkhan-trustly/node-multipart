const multer = require('multer');
const path = require('path');
const fs = require('fs');

if (!fs.existsSync('uploads')) { // Create 'uploads' directory if it doesn't exist
    fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads/'); // Save files in 'uploads' directory
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});
const upload = multer({ storage });

const uploadMiddleware = (req, res, next) => {
    upload.array('files', 5)(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        // Retrieve uploaded files
        const { files } = req;
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded.'});
        }

        const errors = [];

        // Validate file types and sizes
        files.forEach((file) => {
            const allowedTypes = ['image/jpeg', 'image/png'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            /*
            if (!allowedTypes.includes(file.mimetype)) {
                errors.push(`Invalid file type: ${file.originalname}`);
            }*/ // Commented out to allow any file type

            if (file.size > maxSize) {
                errors.push(`File too large: ${file.originalname}`);
            }
        });

        // Handle validation errors
        if (errors.length > 0) {
            // Remove uploaded files
            files.forEach((file) => {
                fs.unlinkSync(file.path);
            });

            return res.status(400).json({ errors });
        }

        // Attach files to the request object
        req.files = files;

        // Proceed to the next middleware or route handler
        next();
    })
};

module.exports = uploadMiddleware;
