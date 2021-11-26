import axios from "axios";
import jwt_decode from "jwt-decode";
import Cookies from "universal-cookie/es6";
import { UserModel } from "../models/user.model";

export const getDecodedJwt = (token: string): Partial<UserModel> => jwt_decode(token); 

export const getSavedJwt = (): string => {
    const cookies = new Cookies();
    return cookies.get('JWT');
}
export const removeSavedJwt = (): void => {
    const cookies = new Cookies();
    cookies.remove('JWT');
}
export const setNewJwt = (jwt: string): void => {
    const cookies = new Cookies();
    cookies.set('JWT', jwt, { path: '/' });
}
export const checkUrl = async (url: string): Promise<boolean> => {
    let isValid: boolean;
    try {
        await axios.get(url);
        isValid = true;
    } catch (err: any) {
        isValid = false;
    }
    return isValid;
}