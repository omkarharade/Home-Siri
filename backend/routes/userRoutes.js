import express from "express";
import { signup, login, upgradeToPremium, checkPremium, getExpiryTime } from "../controllers/userController.js";

const router = express.Router();

// Auth routes
router.post("/signup", signup);
router.post("/login", login);
router.put("/premium", upgradeToPremium);
router.get("/premium", checkPremium);
router.get("/expiry", getExpiryTime);

export default router;