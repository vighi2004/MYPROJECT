require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
// console.log("[cloudinary cfg] NODE_ENV:", process.env.NODE_ENV || "undefined");
// console.log("[cloudinary cfg] CLOUD_NAME:", process.env.CLOUD_NAME);
// console.log("[cloudinary cfg] CLOUD_API_KEY present:", !!process.env.CLOUD_API_KEY);
// console.log("[cloudinary cfg] CLOUD_API_SECRET present:", !!process.env.CLOUD_API_SECRET);

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowed_formats: ['jpeg', 'png', 'jpg'],
  },
});
 module.exports = {
    cloudinary,
    storage
 };