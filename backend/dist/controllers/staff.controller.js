"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStaffProfile = exports.getDepartmentProfile = exports.getStaffProfile = void 0;
const staff_model_1 = require("../models/staff.model");
const getStaffProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const loggedInStaffId = req.staffId;
        if (id !== loggedInStaffId) {
            res.status(403).json({ message: "Unauthorised access" });
            return;
        }
        const staff = yield staff_model_1.StaffModel.findById(id).select("-password").lean();
        if (!staff) {
            res.status(404).json({ message: "Staff not found" });
            return;
        }
        res.json(staff);
    }
    catch (error) {
        console.error("Error fetching staff profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getStaffProfile = getStaffProfile;
const getDepartmentProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const loggedInStaffId = req.staffId;
        if (id !== loggedInStaffId) {
            res.status(403).json({ message: "Unauthorised access" });
            return;
        }
        const staff = yield staff_model_1.StaffModel.findById(id).select("-password").lean();
        if (!staff) {
            res.status(404).json({ message: "Staff not found" });
            return;
        }
        res.json(staff);
    }
    catch (error) {
        console.error("Error fetching staff profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getDepartmentProfile = getDepartmentProfile;
const updateStaffProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const loggedInStaffId = req.staffId;
        if (id !== loggedInStaffId) {
            res.status(403).json({ message: "Unauthorised access" });
            return;
        }
        const { fullName, email, phonenumber, department } = req.body;
        const staff = yield staff_model_1.StaffModel.findByIdAndUpdate(id, { fullName, email, phonenumber, department }, { new: true }).select("-password");
        if (!staff) {
            res.status(404).json({ message: "Staff not found" });
            return;
        }
        res.json(staff);
    }
    catch (error) {
        console.error("Error updating staff profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateStaffProfile = updateStaffProfile;
