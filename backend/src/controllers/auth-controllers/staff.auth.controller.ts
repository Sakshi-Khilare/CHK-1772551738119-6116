import { Request, Response } from "express";
import { StaffModel } from "../../models/staff.model";
import jwt from "jsonwebtoken";
import { z } from "zod";
import bcrypt from "bcryptjs";

const signupSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }
    )
    .trim(),
  email: z.string().email({ message: "Invalid email format" }).trim(),
  phonenumber: z
    .string()
    .length(10, { message: "Phone number must be exactly 10 digits" })
    .trim(),
  department: z.string().trim(),
  departmentAccessCode: z
    .number()
    .int()
    .min(1000, { message: "Department access code must be at least 4 digits" }),
});

export const staffSignup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsedData = signupSchema.parse(req.body);
    const {
      fullName,
      password,
      email,
      phonenumber,
      department,
      departmentAccessCode,
    } = parsedData;

    // Check if the staff already exists
    const existingUser = await StaffModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Staff already exists" });
      return;
    }

    // Hash password and create new staff
    const hashedPassword = await bcrypt.hash(password, 10);
    await StaffModel.create({
      fullName,
      password: hashedPassword,
      email,
      phonenumber,
      department,
      departmentAccessCode,
    });

    console.log("Staff created!");
    res.status(201).json({ message: "Staff Signed up!" });
  } catch (err: any) {
    if (err.name === "ZodError") {
      res.status(400).json({
        message: "Validation failed",
        errors: err.errors,
      });
      return;
    }

    console.error("Error creating staff:", err);
    res
      .status(411)
      .json({ message: "Staff already exists or another error occurred" });
  }
};

export const staffSignin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, departmentAccessCode } = req.body;

    // Find staff by email and access code
    const existingUser = await StaffModel.findOne({
      email,
      departmentAccessCode,
    });
    if (!existingUser) {
      res.status(404).json({ message: "Staff not found!" });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password as string
    );
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: existingUser._id,
        role: "department",
      },
      process.env.JWT_PASSWORD!,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: existingUser._id,
        fullName: existingUser.fullName,
        email: existingUser.email,
        department: existingUser.department,
        phonenumber: existingUser.phonenumber,
        role: "department",
      },
    });
    console.log("Staff signed in!");
  } catch (error) {
    console.error("Error during staff signin:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

