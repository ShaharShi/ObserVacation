import { NextFunction, Request, Response } from "express";
import { ErrorModel } from "../models/error.model";
import { getDecodedJwt } from "../utils/helpers";

export function checkAdminPermissions(req: Request, res: Response<ErrorModel>, next: NextFunction) {
    if (!req.headers?.authorization) return res.status(400).send({ error: 'invalid token...'})
    const token = req.headers.authorization.split(' ')[1]
    const user = getDecodedJwt(token);

    if (user.isAdmin) next()
    else return res.status(401).send({ error: 'You don\'t have the permission to perform this operation.'})
}