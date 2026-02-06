import type { RequestHandler } from 'express';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const cloudUploader: RequestHandler = async (req, res, next) => {
  console.log(req.file);
  try {
    // Upload the image
    const filePath = req.file!.filepath;

    const result = await cloudinary.uploader.upload(filePath);

    req.body.image = result.secure_url;

    next();
  } catch (error) {
    next(error);
  }
};

export default cloudUploader;
