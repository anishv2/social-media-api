import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import { HTTP_CODES } from "../shared/constants/constant.js";


const validator =(schema: AnyZodObject) =>(req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      return res.status(HTTP_CODES.BAD_REQUEST).send(error.error);
    }
  };

export default validator;
