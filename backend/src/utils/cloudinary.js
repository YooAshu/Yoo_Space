import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { ApiError } from "./ApiError.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Ensure path uses correct separators
        const normalizedPath = path.resolve(localFilePath);
        // //console.log("Uploading:", normalizedPath);

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(normalizedPath, {
            resource_type: "auto"
        });

        // //console.log("File uploaded on Cloudinary:", response.secure_url);

        // Remove local file after successful upload
        fs.unlinkSync(normalizedPath);
        return response;

    } catch (error) {
        //console.error("Cloudinary Upload Error:", error);

        // Remove the file only if it exists
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
};

const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId)
        return result.result === 'ok'
    } catch (error) {
        throw new ApiError(500, "failed to delete from cloudinary")
    }
}

export { uploadOnCloudinary, deleteFromCloudinary };