import express from 'express';
import multer from 'multer';
import { createPost, getPosts, deletePost } from '../controllers/publicPostController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });


router.post('/', auth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), createPost);
router.get('/', getPosts);
router.delete('/:id', auth, deletePost);

export default router;
