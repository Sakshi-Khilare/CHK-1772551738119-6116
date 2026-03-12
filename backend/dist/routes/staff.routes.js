"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const staff_auth_controller_1 = require("../controllers/auth-controllers/staff.auth.controller");
const auth_middleware_1 = require("../middlerware/auth.middleware");
const staff_controller_1 = require("../controllers/staff.controller");
const router = (0, express_1.Router)();
// Staff authentication routes
router.post("/staff/signup", staff_auth_controller_1.staffSignup);
router.post("/staff/signin", staff_auth_controller_1.staffSignin);
// Staff profile routes (protected)
router.get("/staff/profile/:id", auth_middleware_1.authMiddleware, staff_controller_1.getStaffProfile);
router.put("/staff/:id", auth_middleware_1.authMiddleware, staff_controller_1.updateStaffProfile);
exports.default = router;
