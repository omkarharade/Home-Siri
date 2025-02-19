import express from "express";
import { 
  getActiveList, 
  getScheduledLists, 
  addToActiveList,
  updateActiveListItem, 
  removeFromActiveList,
  clearActiveList,
} from "../controllers/listController.js";

const router = express.Router();

// Cart routes
router.get("/active", getActiveList);
router.get("/scheduled", getScheduledLists);
router.post("/active/add", addToActiveList);
router.put("/active/update", updateActiveListItem);
router.delete("/active/item/:list_item_id", removeFromActiveList);
router.delete("/active/clear/:list_id", clearActiveList);

export default router;