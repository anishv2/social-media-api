import { Router } from "express";
import { tokenVerify } from "../../../middlewares/tokenverify.js";
import { userController } from "../../../controller/user.js";


const userRouter=Router();

userRouter.get("/posts", tokenVerify, userController.posts);
userRouter.post("/search", tokenVerify, userController.search);
userRouter.post("/follow", tokenVerify, userController.follow);
userRouter.post("/unfollow", tokenVerify, userController.unfollow);
userRouter.post("/recover-account", userController.sendMailToRecoverAccount);
userRouter.post("/otp", userController.sendOTPToRecoverAccount);
userRouter.post("/change-pwd", userController.changePassword);



export default userRouter;