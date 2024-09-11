import { hashSync, compareSync } from "bcrypt";
import { IEncrypt } from "../shared/interfaces/index.js";

const encrypt = {
  SALT: parseInt(process.env.SALT!),
  hashPassword(plainPassword) {
    return hashSync(plainPassword, this.SALT);
  },
  comparePassword(plainPassword, dbPassword) {
    return compareSync(plainPassword, dbPassword);
  },
} as IEncrypt;

export default encrypt;
