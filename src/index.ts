"use strict";

import express, { Application, Express, Request, Response } from "express";
import AppConfig from "./config/env.config.js";
import bodyParser from "body-parser";
import cors from "cors";
import { dbConnection } from "./config/db/connect.js";
import publicRouter from "./config/routes/public.js";
import { AddressInfo } from "net";
import postRouter from "./config/routes/private/posts.js";
import authRouter from "./config/routes/private/auth.js";
import { cloudinaryConnection } from "./config/cloudinary.js";
import commentRouter from "./config/routes/private/comments.js";
import userRouter from "./config/routes/private/user.js";

const app: Express = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false, limit:'1mb' }));

// cors declaration
app.use(
  cors({
    origin: AppConfig.corsOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // access-control-allow-credentials:true
  })
);


app.get("/", (_: Request, res: Response) =>
  res.json({
    message: "Hey, this is a Social Media Server",
    author: "Anish Verma"
  })
);

app.use("/api/v1/auth", publicRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/user", userRouter);


const server = app.listen(AppConfig.port || 5000, () => {
  const { port } = server.address() as AddressInfo;
  console.log(`***** Social Media Server started at port ${port} *****`);
  dbConnection();
  cloudinaryConnection();
});


