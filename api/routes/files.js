import express from "express";
import { retrieveImages, geImageByID, geImageByUserID, geImageByRoomID } from "../controllers/images.js";

const router = express.Router()

router.get("/retrieve_images", retrieveImages)
router.get("/get_image_by_id:imageID", geImageByID)
router.get("/get_image_by_roomid:roomID", geImageByRoomID)
router.get("/get_image_by_userID:userID", geImageByUserID)

export default router