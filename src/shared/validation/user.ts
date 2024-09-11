import { TypeOf, object, string } from "zod";

const createUserSchema = object({
  body:object({
    firstName: string({ required_error: "Firstname is required" })
      .min(3, { message: "Firstname must be of minimum 3 characters" })
      .max(30, { message: "Firstname must be of maximum 100 characters" }),
    lastName: string({ required_error: "Lastname is required" })
      .min(3, { message: "Lastname must be of minimum 3 characters" })
      .max(30, { message: "Lastname must be of maximum 30 characters" }),
    gender: string({ required_error: "Gender is required"}),    
    email: string({ required_error: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: string({ required_error: "Password is required" })
      .min(8, { message: "Password must be atleast 8 characters" }),
    repeatPassword: string({ required_error: "Password is required" })
      .min(8, { message: "Repeat password must be atleast 8 characters" })

  }).refine((data) => data.password === data.repeatPassword, {
  message: "Passwords do not match",
  path: ["repeatPassword"],
  })
});

const loginUserSchema = object({
  body:object({
    email: string({ required_error: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: string({ required_error: "Password is required" })
      .min(8, { message: "Password must be atleast 8 characters" })
  })
});


type CreateUserType = Omit<TypeOf<typeof createUserSchema>, "body.repeatPassword">
type LoginUserType = TypeOf<typeof loginUserSchema>


export {
  createUserSchema,
  CreateUserType,
  loginUserSchema,
  LoginUserType
};

