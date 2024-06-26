import express from "express";
import { searchByTitle, getRoomByID, retireveRoomByID, searchRoomsOutsideDateRange } from "../controllers/filtering.js";
import  {getServiceByID} from "../controllers/amenity.js"
const router = express.Router()

router.get("/search_by_title:term", searchByTitle);
router.get("/look_for:roomID", getRoomByID);
router.get("/retrieve_room:roomID", retireveRoomByID);
router.get("/search_available_rooms", searchRoomsOutsideDateRange);
router.get("/get_serviceByID:serviceID", getServiceByID);

export default router