import { model, Schema } from "mongoose";

const StaffSchema = new Schema(
  {
    fullName: { type: String, required: true },
    password: {
      type: String,
      required: [true, "Password is required"],
      min: [8, "Password must be at least 8 characters"],
    },
    email: { type: String, required: true, lowercase: true, unique: true },
    phonenumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      enum: [
        "Road Infrastructure",
        "Waste Management",
        "Environmental Issues",
        "Utilities & Infrastructure",
        "Public Safety",
        "Other",
      ],
    },
    departmentAccessCode: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const StaffModel = model("Staff", StaffSchema);

