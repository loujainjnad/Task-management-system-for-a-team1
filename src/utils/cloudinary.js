const cloudinary = require('cloudinary').v2;

/**
 * Configure Cloudinary
 * إعداد Cloudinary
 */
const configureCloudinary = () => {
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log('Cloudinary configured successfully');
    return true;
  } else {
    console.log('Cloudinary not configured - skipping');
    return false;
  }
};

/**
 * Upload Image to Cloudinary
 * رفع صورة إلى Cloudinary
 */
const uploadImage = async (filePath, folder = 'taskman') => {
  try {
    if (!configureCloudinary()) {
      throw new Error('Cloudinary غير مُعد');
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' },
        { quality: 'auto' },
      ],
    });

    return {
      public_id: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('فشل رفع الصورة');
  }
};

/**
 * Delete Image from Cloudinary
 * حذف صورة من Cloudinary
 */
const deleteImage = async (publicId) => {
  try {
    if (!configureCloudinary()) {
      return false;
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
};

module.exports = {
  configureCloudinary,
  uploadImage,
  deleteImage,
};

