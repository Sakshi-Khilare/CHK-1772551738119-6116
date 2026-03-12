import { StaffModel } from "../models/staff.model";
import { IssueModel } from "../models/issue.model";
import { MultimediaModel } from "../models/multimedia.model";
import { IssueStatusHistoryModel } from "../models/issueStatusHistory.model";
import { Request, Response } from "express";
import mongoose from "mongoose";

interface AuthRequest extends Request {
  staffId?: string;
  department?: string;
}

// Get issues for the department (staff's department)
export const getDepartmentIssues = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // First get the staff's department
    const staff = await StaffModel.findById(req.staffId).select("department").lean();
    
    if (!staff) {
      res.status(404).json({ message: "Staff not found" });
      return;
    }

    // Get issues matching the department's issueType
    const issues = await IssueModel.find({ issueType: staff.department })
      .populate("citizenId", "fullName")
      .lean();

    const issuesWithMedia = await Promise.all(
      issues.map(async (issue) => {
        const media = await MultimediaModel.find({ issueID: issue._id });
        return {
          _id: issue._id,
          title: issue.title,
          description: issue.description,
          type: issue.issueType,
          location: issue.location,
          reportedBy: (issue.citizenId as any)?.fullName || "Anonymous",
          reportedAt: issue.createdAt,
          image: media.length > 0 ? media[0].url : null,
          status: issue.status,
        };
      })
    );

    res.json({ issues: issuesWithMedia });
  } catch (error) {
    console.error("Error fetching department issues:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update issue status
export const updateIssueStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Reported", "In Progress", "Resolved", "Rejected", "Pending"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    const issue = await IssueModel.findById(id);
    if (!issue) {
      res.status(404).json({ message: "Issue not found" });
      return;
    }

    const oldStatus = issue.status;
    issue.status = status;
    await issue.save();

    // Record status history
    await IssueStatusHistoryModel.create({
      issueId: id,
      oldStatus,
      newStatus: status,
      changedBy: req.staffId,
    });

    res.json({ message: "Issue status updated", issue });
  } catch (error) {
    console.error("Error updating issue status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getStaffProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const loggedInStaffId = req.staffId;

    if (id !== loggedInStaffId) {
      res.status(403).json({ message: "Unauthorised access" });
      return;
    }

    const staff = await StaffModel.findById(id).select("-password").lean();

    if (!staff) {
      res.status(404).json({ message: "Staff not found" });
      return;
    }

    res.json(staff);
  } catch (error) {
    console.error("Error fetching staff profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getDepartmentProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const loggedInStaffId = req.staffId;

    if (id !== loggedInStaffId) {
      res.status(403).json({ message: "Unauthorised access" });
      return;
    }

    const staff = await StaffModel.findById(id).select("-password").lean();

    if (!staff) {
      res.status(404).json({ message: "Staff not found" });
      return;
    }

    res.json(staff);
  } catch (error) {
    console.error("Error fetching staff profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateStaffProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const loggedInStaffId = req.staffId;

    if (id !== loggedInStaffId) {
      res.status(403).json({ message: "Unauthorised access" });
      return;
    }

    const { fullName, email, phonenumber, department } = req.body;

    const staff = await StaffModel.findByIdAndUpdate(
      id,
      { fullName, email, phonenumber, department },
      { new: true }
    ).select("-password");

    if (!staff) {
      res.status(404).json({ message: "Staff not found" });
      return;
    }

    res.json(staff);
  } catch (error) {
    console.error("Error updating staff profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
