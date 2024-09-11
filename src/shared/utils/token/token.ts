import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"; // dont import * as jwt here
import { IToken } from "../../interfaces/index.js";
import AppConfig from "../../../config/env.config.js";

export interface IDecode extends JwtPayload {
  email: string;
  id: string;
  iat: number;
  exp: number;
}

export type TRequestAuth = Request & { decode: IDecode };

export enum TOKEN {
  ACCESS_TOKEN='ACCESS_TOKEN',
  REFRESH_TOKEN='REFRESH_TOKEN'
}

export const decodedUser=(req: Request)=>{
  return (<TRequestAuth>req)["decode"];
}

const tokenObject = {
  tokenEncode(payload) {
    const { id }=payload;
    const accessToken= jwt.sign(payload, AppConfig.accessTokenKey, { algorithm: "HS256", expiresIn: AppConfig.accessTokenExpiry });
    const refreshToken=jwt.sign({ id }, AppConfig.refreshTokenKey, { algorithm: "HS256", expiresIn: AppConfig.refreshTokenExpiry });
    return { accessToken, refreshToken}

  },
 
  tokenDecode(token, tokenType, req) {
    try {
      let decode={} as IDecode;
      if(tokenType===TOKEN['ACCESS_TOKEN']){
        decode = jwt.verify(token, AppConfig.accessTokenKey) as IDecode;
      }
      if(tokenType===TOKEN['REFRESH_TOKEN']){
        decode = jwt.verify(token, AppConfig.refreshTokenKey) as IDecode;
      }
      if (decode?.id) {
        (<TRequestAuth>req)["decode"] = decode;
        return true;
      } else {
        return false;
      }
    
    } catch (err) {
      throw new Error("Unauthorized");
    }
  },
} as IToken;

export default tokenObject;
