
import { Router } from "express";
import { authController } from "../../controller/auth/auth.js";
import validator from "../../middlewares/validator.js";
import { createUserSchema, loginUserSchema } from "../../shared/validation/user.js";
import { userController } from "../../controller/user.js";


const publicRouter=Router();
publicRouter.post('/', validator(loginUserSchema), authController.login);
publicRouter.post('/new', validator(createUserSchema), authController.register);

export default publicRouter;
