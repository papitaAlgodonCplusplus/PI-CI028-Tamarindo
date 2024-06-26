import express from "express";
import { logout, register, changePassword, login, getUserID, getEmail, getUserByID, deleteUser } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/changePassword", changePassword);
router.post("/logout", logout);
router.get("/getUserID:email", getUserID);
router.get("/getEmail:userID", getEmail);
router.get("/getUserbyID:userID", getUserByID);
router.delete("/:email", deleteUser)

export default router;