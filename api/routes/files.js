import express from "express";
import { retrieveImages, geImageByID, geImageByFilename, addImage } from "../controllers/images.js";

const router = express.Router()

router.post("/", addImage)
router.get("/retrieve_images", retrieveImages)
router.get("/get_image_by_id:imageID", geImageByID)
router.get("/get_image_by_filename:filename", geImageByFilename)

export default router