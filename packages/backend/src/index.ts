import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app: Express = express();
// Change port to avoid conflict
const port = process.env.PORT || 3002;

// Configuration for file size limits (in bytes)
const MAX_AUDIO_SIZE_MB = parseInt(process.env.MAX_AUDIO_SIZE_MB || '50', 10);
const MAX_VIDEO_SIZE_MB = parseInt(process.env.MAX_VIDEO_SIZE_MB || '200', 10);
const MAX_AUDIO_SIZE_BYTES = MAX_AUDIO_SIZE_MB * 1024 * 1024;
const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Common Multer disk storage setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Multer instance for audio uploads
const audioUpload = multer({
    storage: storage,
    limits: { fileSize: MAX_AUDIO_SIZE_BYTES },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only MP3 and WAV are allowed for audio.'));
        }
    }
});

// Multer instance for video uploads
const videoUpload = multer({
    storage: storage,
    limits: { fileSize: MAX_VIDEO_SIZE_BYTES },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'video/mp4') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only MP4 is allowed for video.'));
        }
    }
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.status(200).send('OK');
});

// Audio upload endpoint
app.post('/upload/audio', (req: Request, res: Response, next: NextFunction) => {
    audioUpload.single('audio')(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).send({ message: `Audio file too large. Maximum size is ${MAX_AUDIO_SIZE_MB}MB.` });
            }
            return res.status(400).send({ message: `Multer error: ${err.message}` });
        } else if (err) {
            // An unknown error occurred when uploading.
            return res.status(400).send({ message: err.message }); // This will catch file type errors from fileFilter
        }

        if (!req.file || !req.file.filename) {
            console.error('File upload error: req.file or filename missing', req.file);
            return res.status(400).send({ message: 'No audio file uploaded or fileId missing.' });
        }
        console.log('Audio file uploaded:', req.file);
        res.status(200).send({
            message: 'Audio file uploaded successfully',
            fileId: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path
        });
    });
});

// Video upload endpoint
app.post('/upload/video', (req: Request, res: Response, next: NextFunction) => {
    videoUpload.single('video')(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).send({ message: `Video file too large. Maximum size is ${MAX_VIDEO_SIZE_MB}MB.` });
            }
            return res.status(400).send({ message: `Multer error: ${err.message}` });
        } else if (err) {
            return res.status(400).send({ message: err.message }); // This will catch file type errors from fileFilter
        }

        if (!req.file) {
            return res.status(400).send({ message: 'No video file uploaded.' });
        }

        res.status(200).send({
            message: 'Video file uploaded successfully',
            fileId: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path
        });
    });
});

// Serve uploaded files
app.use('/files', express.static(uploadsDir));

// Basic Error Handling Middleware for other errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Unhandled error:", err.stack);
    // Check if headers have already been sent
    if (res.headersSent) {
        return next(err); // Delegate to default Express error handler
    }
    res.status(500).send('Something broke on the server!');
});

app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
    console.log(`Max audio file size: ${MAX_AUDIO_SIZE_MB}MB`);
    console.log(`Max video file size: ${MAX_VIDEO_SIZE_MB}MB`);
});