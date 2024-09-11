import { Request } from "express";

interface IMessageReader {
  message: string | null;
  readMessageFile: () => void;
  readMessage: (key1: string, key2: string) => string;
}
interface IEncrypt {
  SALT: number;
  hashPassword: (plainPassword: string) => string;
  comparePassword: (plainPassword: string, dbPassword: string) => boolean;
}

interface IToken {
  tokenEncode: (payload: {email: string; firstName:string; id: string; }) => { accessToken: string; refreshToken: string};
  tokenDecode: (token: string, tokenType: string, req?: Request<any> ) => boolean;
}
interface IUser {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  password: string;
  refreshToken: string;
}

export {
  IMessageReader,
  IEncrypt,
  IToken,
  IUser
}