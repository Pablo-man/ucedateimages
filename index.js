import express from 'express';
import morgan from 'morgan';
import {config} from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';
import fs from 'fs';

config()

const app = express()
const PORT = process.env.PORT || 3000;
const upload = multer({ dest: 'uploads/' });

app.use(morgan('dev'));
app.use(cors());

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Routes
app.post('/upload', upload.single('image'), async(req, res) => {

    const uid = req.body.uid;


    try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'android_profiles',
      public_id: uid,
      overwrite: true
    });

    // Limpieza del archivo temporal
    fs.unlinkSync(req.file.path);

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error for upload file' });
  }
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})