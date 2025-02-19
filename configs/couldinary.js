const cloudinary = require('cloudinary').v2;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
// Helper function to upload image to Cloudinary
async function uploadCloudinary(filePath) {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    });

    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'Synram',  
        });
        
        return result.secure_url;  
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error('Failed to upload image');
    }
}

module.exports = uploadCloudinary;
