const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const multer = require('multer');
const path = require('path');

// __dirname is already available in CommonJS

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Frontend dev server
  credentials: true
}));
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  }
});

// Serve audio files statically from /files (maps to ../uploads/audio)
app.use('/files', cors(), express.static(path.join(__dirname, '../uploads/audio'), {
  setHeaders: (res, path, stat) => {
    // Set appropriate Content-Type based on file extension
    if (path.endsWith('.mp3')) {
      res.set('Content-Type', 'audio/mpeg');
    } else if (path.endsWith('.wav')) {
      res.set('Content-Type', 'audio/wav');
    } else if (path.endsWith('.ogg')) {
      res.set('Content-Type', 'audio/ogg');
    } else {
      res.set('Content-Type', 'audio/mpeg'); // Default
    }
    // Set CORS headers explicitly
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, HEAD');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Range');
    // Cache control for better performance
    res.set('Cache-Control', 'public, max-age=3600');
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Audio upload endpoint
app.post('/upload/audio', upload.single('audio'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    // Validate file type
    const allowedTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/wave', 'audio/x-wav'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Invalid audio file type' });
    }

    res.json({
      success: true,
      fileId: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('Audio upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Video upload endpoint
app.post('/upload/video', upload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Invalid video file type' });
    }

    res.json({
      success: true,
      fileId: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve uploaded files
app.use('/files', express.static(path.join(__dirname, '../uploads')));

// Error handling middleware
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});

export default app; 