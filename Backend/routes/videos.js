import express from 'express';
import { getAllVideosController, uploadVideoController } from '../controllers/VideoController.js';
import { authenticateJWT } from '../middleware/auth.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for both video and thumbnail uploads
const upload = multer({ dest: 'uploads/' });

// GET all videos
router.get('/', getAllVideosController);

// POST upload video (accepts both video and thumbnail)
router.post(
  '/upload',
  authenticateJWT,
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]),
  uploadVideoController
);

export default router;
