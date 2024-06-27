import express from "express";
import { deleteRoomType } from "../controllers/accomodations.js";

const router = express.Router()

router.delete("/delete_room_type:id", deleteRoomType);

export default router