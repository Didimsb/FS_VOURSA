const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage with larger file size limit
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 500 * 1024 * 1024, // 500MB limit
    fieldSize: 500 * 1024 * 1024 // 500MB field size
  }
});

// Upload to Cloudinary
router.post('/cloudinary', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Check file size
    const fileSizeInMB = req.file.size / (1024 * 1024);
    if (fileSizeInMB > 500) {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum allowed size is 500MB'
      });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

    // Upload to Cloudinary with progress tracking
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'voursa',
      resource_type: 'auto',
      chunk_size: 6000000, // 6MB chunks for better progress tracking
      eager: [
        { width: 300, height: 300, crop: "pad", audio_codec: "none" },
        { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" }
      ],
      eager_async: true
    });

    res.json({
      success: true,
      secure_url: result.secure_url,
      public_id: result.public_id,
      file_size: req.file.size
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading file: ' + error.message
    });
  }
});

// Upload with progress tracking
router.post('/cloudinary-progress', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Set headers for SSE (Server-Sent Events)
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    // Send initial progress
    res.write(`data: ${JSON.stringify({ progress: 0, status: 'starting' })}\n\n`);

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

    // Upload to Cloudinary with progress tracking
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'voursa',
      resource_type: 'auto',
      chunk_size: 6000000,
      eager: [
        { width: 300, height: 300, crop: "pad", audio_codec: "none" },
        { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" }
      ],
      eager_async: true
    }, (error, result) => {
      if (error) {
        res.write(`data: ${JSON.stringify({ progress: 100, status: 'error', error: error.message })}\n\n`);
        res.end();
      } else {
        res.write(`data: ${JSON.stringify({ progress: 100, status: 'complete', result })}\n\n`);
        res.end();
      }
    });

    // Send progress updates
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 90) {
        clearInterval(progressInterval);
        progress = 90;
      }
      res.write(`data: ${JSON.stringify({ progress: Math.round(progress), status: 'uploading' })}\n\n`);
    }, 1000);

  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.write(`data: ${JSON.stringify({ progress: 100, status: 'error', error: error.message })}\n\n`);
    res.end();
  }
});

module.exports = router; 