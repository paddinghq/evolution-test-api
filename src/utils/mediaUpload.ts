import multer, { Multer } from 'multer';
import { RequestHandler } from 'express';
import { InvalidInput, ServerError } from "../middlewares/errorHandler";
import { v2 as cloudinary } from "cloudinary"

// Define a type for the Multer middleware
type MulterMiddleware = Multer | RequestHandler;

//Process media upload using multer
export const uploadMedia = (numberOfFile: string): MulterMiddleware => {
    try {
        const storage = multer.diskStorage({});

        const upload = multer({
            storage: storage
        });

        if (numberOfFile === "single") {
            return upload.single("mediaFile");
        }

        if (numberOfFile === "multiple") {
            return upload.array("mediaFiles");
        }

        throw new InvalidInput("Please provide a valid parameter");
    } catch (error) {
        throw new ServerError("Multer error")
    }
};



// save upload file to cloudinary
export const saveToCloudinary = async (filePath: string, folderName: string) => {
    try {
        return await cloudinary.uploader.upload(filePath, {
            folder: folderName,
            resource_type: "auto",
        })
    } catch (error) {
        throw new ServerError("Cloudinary Error!!!")
    }
}
