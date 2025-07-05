import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ideas", // Cloudinary folder name
    resource_type: "auto", // Supports both images & videos
    allowedFormats: ["jpg", "png", "jpeg", "gif", "mp4", "mov", "avi"], // Allowed formats
  },
});

const upload = multer({ storage });

export default upload;
