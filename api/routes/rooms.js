import express from "express";
import { addRoom, updateRooms, deleteRoom, getImagesFilenames, searchImages, updateRoomsByID } from "../controllers/accomodations.js";

const router = express.Router()

router.get("/", updateRooms);
router.get("/by_roomID:roomID", updateRoomsByID);
router.delete("/delete:roomID", deleteRoom);
router.post("/add_room", addRoom);
router.get("/get_filenames", getImagesFilenames)
router.get("/get_images", searchImages)

export default router