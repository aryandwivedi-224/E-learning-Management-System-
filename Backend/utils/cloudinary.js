import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({});

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  export const uploadMedia = async (file) => {
    try {
        console.log("File path received:", file); // Debug log
        if (!file) {
            throw new Error("No file path provided");
        }

      const uploadResponse = await cloudinary.uploader.upload(file, {
        resource_type: "auto",
            folder: "profile_photos" // Organize uploads in a folder
        });   
        
        console.log("Cloudinary upload response:", {
            secure_url: uploadResponse.secure_url,
            public_id: uploadResponse.public_id,
            format: uploadResponse.format
        });
        
        if (!uploadResponse.secure_url) {
            throw new Error("No secure URL in Cloudinary response");
        }
        
      return uploadResponse;
    } catch (error) {
        console.log("Cloudinary upload error:", error);
        throw error;
    }
  };

  export const deleteMediaFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary delete response:", result); // Debug log
        return result;
    } catch (error) {
        console.log("Cloudinary delete error:", error);
        throw error;
    }
  };

  export const deleteVideoFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId,{resource_type:"video"});
    } catch (error) {
        console.log(error);
        
    }
}