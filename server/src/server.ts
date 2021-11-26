import express from "express";
import cors from "cors";
import expressJwt from "express-jwt";
import dotenv from 'dotenv';
import { authRouter } from "./routers/auth.router";
import { vacationsRouter } from "./routers/vacations.router";
import http from 'http';
import * as socketIo from 'socket.io';

import path from 'path';

dotenv.config();
const PORT = 4000;

const { JWT_SECRET = "secret" } = process.env;

const app = express();
const server = http.createServer(app);
const io = new socketIo.Server(server);

app.use(cors());
app.use(express.json());
app.use(expressJwt({secret: JWT_SECRET}).unless({path: ['/api/auth/login', '/api/auth/signup']}));

app.use('/api/auth', authRouter);
app.use('/api/vacations', vacationsRouter);

app.use((err: any, req: any, res: any, next: any) =>  {
    if (err.name === 'UnauthorizedError') res.status(401).send('invalid token...')
})

server.listen(PORT, () => console.log(`Server is up at ${PORT}`)); 

io.on('connection', socket => {
    console.log('new connection');
    socket.on('unfollow_vacation', vacationId => { socket.broadcast.emit('unfollow_vacation', vacationId) });
    socket.on('follow_vacation', vacationId => { socket.broadcast.emit('follow_vacation', vacationId) });
    socket.on('update_vacation', updatedVacation => { socket.broadcast.emit('update_vacation', updatedVacation) });
    socket.on('add_vacation', newVacation => { socket.broadcast.emit('add_vacation', newVacation) });
    socket.on('remove_vacation', vacationId => { socket.broadcast.emit('remove_vacation', vacationId) });
});