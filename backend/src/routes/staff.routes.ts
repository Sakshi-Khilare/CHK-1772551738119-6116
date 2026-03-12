import { Router } from "express";
import { staffSignup, staffSignin } from "../controllers/auth-controllers/staff.auth.controller";
import { authMiddleware } from "../middlerware/auth.middleware";
import { getStaffProfile, updateStaffProfile, getDepartmentIssues, updateIssueStatus } from "../controllers/staff.controller";

const router = Router();

// Staff authentication routes
router.post("/staff/signup", staffSignup);
router.post("/staff/signin", staffSignin);

// Staff profile routes (protected)
router.get("/staff/profile/:id", authMiddleware, getStaffProfile);
router.put("/staff/:id", authMiddleware, updateStaffProfile);

// Department issues routes (protected)
router.get("/staff/issues", authMiddleware, getDepartmentIssues);
router.put("/staff/issues/:id/status", authMiddleware, updateIssueStatus);

export default router;

