console.log("starting server...")

import express from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import * as usersController from "./controllers/users";
import bodyParser from "body-parser";
import authMiddleware from "./middlewares/auth";
import cors from "cors";
import * as boardsController from "./controllers/boards";
import * as columnsController from "./controllers/columns"
import * as tasksController from "./controllers/tasks";

import jwt from 'jsonwebtoken'
import { privateKey } from "./config"
import User from './models/user'

import { SocketEventsEnum } from "./types/socketEvents.enum";
import {Socket} from './types/socket.interface'
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 8080


const io = new Server(httpServer, {
    cors: {
        origin: '*' // host of the domain 
    }
});

app.use(cors())
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {res.send('Api is up');});

mongoose.set('toJSON', {virtuals: true, transform:(_, converted) => { delete converted._id }})

app.post('/api/users', usersController.register)
app.post('/api/users/login', usersController.login)
app.get('/api/user', authMiddleware, usersController.currentUser)
app.get('/api/boards', authMiddleware, boardsController.getBoards)
app.post('/api/boards', authMiddleware, boardsController.createBoard)
app.get('/api/boards/:boardId', authMiddleware, boardsController.getBoard)
app.get('/api/boards/:boardId/columns', authMiddleware, columnsController.getColumns)
app.get('/api/boards/:boardId/tasks', authMiddleware, tasksController.getTasks)



io.use(async (socket: Socket, next) => {
    try {   
        const token = (socket.handshake.auth.token as string) ?? ''
        const data = jwt.verify(token.split(' ')[1], privateKey) as {
            id: string;
            email: string;
        }
        const user = await User.findById(data.id)

        if(!user){
            return next(new Error('Auth error'))
        }
        socket.user = user
        next()
    } catch(err){
        next(new Error ('Auth error'))
    }
}).on('connection', (socket) => {

    socket.on(SocketEventsEnum.boardsJoin, (data) => {
        boardsController.joinBoard(io, socket, data)
    })

    socket.on(SocketEventsEnum.boardsLeave, (data) => {
        boardsController.leaveBoard(io, socket, data)
    })

    socket.on(SocketEventsEnum.columnsCreate, (data) => {
        columnsController.createColumn(io, socket, data)
    })

    socket.on(SocketEventsEnum.tasksCreate, (data) => {
        tasksController.createTask(io, socket, data)
    })

    socket.on(SocketEventsEnum.boardsUpdate, (data) => {
        boardsController.updateBoard(io, socket, data)
    })

    socket.on(SocketEventsEnum.boardsDelete, (data) => {
        boardsController.deleteBoard(io, socket, data)
    })

    socket.on(SocketEventsEnum.columnsDelete, (data) => {
        columnsController.deleteColumn(io, socket, data)
    })

    socket.on(SocketEventsEnum.tasksDelete, (data) => {
        tasksController.deleteTask(io, socket, data)
    })

    // socket.on(SocketEventsEnum.tasksUpdate, (data) => {
    //     tasksController.updateTask(io, socket, data)
    // })

    socket.on(SocketEventsEnum.tasksDelete, (data) => {
        tasksController.deleteTask(io, socket, data)
    })
});


mongoose.connect('mongodb://localhost:27017/epam-project').then(()=>{
    console.log('connected to mongodb');

    httpServer.listen(PORT, () => { //port 8080?..
        console.log(`Api is listening on port ${PORT}`);
    });
}); 
//npm install nodemon -D (Devdependensies)
//npm install ts-node -D 
//npm i validator
//npm i @types/validator -D
//npm i bcryptjs
//npm i @types/bcryptjs -D
//npm i body-parser
//npm i jsonwebtoken
//npm i @types/jsonwebtoken -D
//npm i cors

