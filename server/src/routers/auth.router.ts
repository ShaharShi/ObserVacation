import express, { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import { addUser, fetchUser } from '../db/queries';
import { generateJWT } from '../utils/helpers';
import dotenv from 'dotenv';
import { ErrorModel } from '../models/error.model';
dotenv.config();

export const authRouter = Router()

authRouter.get("/login", async (req: Request<{userName: string, password: string}>, res: Response<{ jwt: string} | ErrorModel>) => {
    const { userName, password } = req.query;
    if (!userName || !password) return res.status(400).send({ error: 'Both user name and password are require fields !' })
    
    const user = await fetchUser(userName as string);
    if (!user) return res.status(400).send({ error: 'Incorrect user name / password, try again !' });
    
    const validPassword = await bcrypt.compare(password as string, user.password);
    if (!validPassword) return res.status(400).send({ error: 'Incorrect user name / password, try again !' })
    
    const userIdAsNumber = Number(user.id)
    const jwt = await generateJWT(user.userName, userIdAsNumber, Number(user.isAdmin) ? true : false, process.env.JWT_SECRET as string) as string;
    
    res.status(200).send({ jwt: jwt });
})
authRouter.post("/signup", async (req: Request<{firstName: string, lastName: string, userName: string, password: string}>, res: Response<{ _id: number, jwt: string} | ErrorModel>) => {
    const { firstName, lastName, userName, password } = req.body;
    if (!firstName || !lastName || !userName || !password) return res.status(400).send({ error: 'All fields are required !' })

    const userAlreadyExist = await fetchUser(userName as string);
    if(userAlreadyExist) return res.status(400).send({ error: 'User already exist...' })

    const salt = await bcrypt.genSalt(10);
    const bycryptedPassword = await bcrypt.hash(password, salt);

    const result = await addUser(firstName, lastName, userName, bycryptedPassword)
    if(!result.affectedRows) res.status(500).send({ error: 'Some error occurred, please refresh the page and try again !' })
    
    const userIdAsNumber = Number(result.insertId)
    const jwt = await generateJWT(userName, userIdAsNumber, false, process.env.JWT_SECRET as string) as string;
    
    res.status(201).send({ _id: result.insertId, jwt: jwt });
})