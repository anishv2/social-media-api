
import cloudinary from "../../config/cloudinary.js";


export const deleteUploadImage=async(publicId: string)=>{
    await cloudinary.uploader.destroy(publicId, ()=>{
        console.log('Image deleted from Cloudinary');
    });
};