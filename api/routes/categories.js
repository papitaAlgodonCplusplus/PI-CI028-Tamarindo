import express from "express";
import { updateRoomType, updateRoomTypesByID, addRoomType, deleteRoomType, updateRoomTypes } from "../controllers/category.js";

const router = express.Router()

router.get("/room_types", updateRoomTypes);
router.get("/room_type_ByID:roomTypeID", updateRoomTypesByID);
router.delete("/delete_room_type:roomID", deleteRoomType);
router.post("/add_room_type", addRoomType);
router.put("/update_room_type", updateRoomType)

export default router