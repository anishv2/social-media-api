import { Schema, model } from "mongoose";
import { IUser } from "../../shared/interfaces/index.js";

enum GENDER {
  MALE= "Male",
  FEMALE= "Female",
  OTHER= "Other",
};

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: [true, "Please provide first name"] },
    lastName: { type: String, required: [true, "Please provide last name"] },
    gender: { type: String, enum: GENDER },
    email: { type: String, required: [true, "Please provide email"] },
    password: { type: String, required: [true, "Please provide password"] },
  },
  { timestamps: true }
);

const UserModel = model<IUser>("Users", userSchema);

export default UserModel;
