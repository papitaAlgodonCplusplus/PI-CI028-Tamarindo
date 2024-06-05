import express from "express";
import { addService, getListByReservationID, updateServices, updateAmenity, deleteService, getService, addToServiceLog, getSumByReservationID} from "../controllers/amenity.js";

const router = express.Router()

router.get("/", updateServices);
router.get("/get_service:serviceName", getService);
router.delete("/delete:serviceID", deleteService);
router.post("/add_amenity", addService);
router.post("/add_to_service_log", addToServiceLog)
router.get("/get_sum:reservationID", getSumByReservationID);
router.get("/get_all:reservationID", getListByReservationID);
router.put("/update_amenity", updateAmenity)
export default router