"use strict";
import { Router } from "express";
import { authController } from "../../../controller/auth/auth.js";
import { tokenVerify } from "../../../middlewares/tokenverify.js";

const authRouter=Router();
authRouter.post('/refresh', authController.refreshToken);

export default authRouter;
