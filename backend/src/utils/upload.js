const cloudinary = require("../config/cloudinary");

async function uploadToCloudinary(fileBuffer, fileName, folder = "converso") {
  try {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { 
          folder: folder,
          resource_type: "auto", // Auto-detect file type
          public_id: `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '')}`,
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      stream.end(fileBuffer);
    });
  } catch (err) {
    throw new Error(`Upload failed: ${err.message}`);
  }
}

async function deleteFromCloudinary(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (err) {
    console.error("Error deleting from Cloudinary:", err);
    return false;
  }
}

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};
