import express from "express";
import { protect } from "../../middleware/authMiddleware.js";

import {
  createDiscussion,
  getProblemDiscussions,
} from "./discussioncontroller.js";

const router = express.Router();

router.post("/", protect, createDiscussion);

router.get("/problem/:problemId", getProblemDiscussions);

export default router;