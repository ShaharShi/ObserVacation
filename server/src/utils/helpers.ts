import jwt from 'jsonwebtoken';
import jwt_decode from "jwt-decode";
import { promisify } from 'util';
import { UserModel } from '../models/user.model';

const promisifiedJwtSign = promisify(jwt.sign)

export const generateJWT = (userName: string, id: number, isAdmin: boolean, secret: string) => {
    return promisifiedJwtSign({userName, id, isAdmin}, secret);
}

export const getDecodedJwt = (token: string): Partial<UserModel> => jwt_decode(token); 