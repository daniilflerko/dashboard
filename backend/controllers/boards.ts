import BoardModel from "../models/board";
import { NextFunction, Request, Response } from "express";
import { RequestInterface } from "../types/request.interface";
import { Server } from "socket.io";

import {Socket} from '../types/socket.interface'
import { SocketEventsEnum } from "../types/socketEvents.enum";
import { getError } from "../shared";


export const getBoards = async(req: RequestInterface, res: Response, next: NextFunction) => {
    try{
        if(!req.user){
            return res.sendStatus(420)
        }

        const boards = await BoardModel.find({userId: req.user.id})
        res.send(boards);
    } catch(err){
        next(err)
    }
}

export const createBoard = async(req: RequestInterface, res: Response, next: NextFunction) => {
    try{
        if(!req.user){
            return res.sendStatus(420)
        }

        const newBoard = new BoardModel({
            title: req.body.title,
            description: req.body.description,
            createdAt: Date(),
            userId: req.user.id
        })

        const savedBoard = await newBoard.save()
        res.send(savedBoard);
    } catch(err){
        next(err)
    }
}

export const getBoard = async(req: RequestInterface, res: Response, next: NextFunction) => {
    try{
        if(!req.user){
            return res.sendStatus(420)
        }

        const board = await BoardModel.findById(req.params.boardId)
        res.send(board);
    } catch(err){
        next(err)
    }
}



export const joinBoard = (io: Server, socket: Socket, data: {boardId: string}) => {
    console.log('socket join', socket.user)
    socket.join(data.boardId)
}
export const leaveBoard = (io: Server, socket: Socket, data: {boardId: string}) => {
    console.log('socket leave', data.boardId)
    socket.leave(data.boardId)
}
export const updateBoard = async (io: Server, socket: Socket, data: { boardId: string, fields: {title: string}}) => {
    try{
        if(!socket.user){
            socket.emit(SocketEventsEnum.boardsNotUpdated, 'no auth user')
            return
        }

        const updatedBoard = await BoardModel.findByIdAndUpdate(data.boardId, data.fields, {new: true})
        socket.emit(SocketEventsEnum.boardsUpdated, updatedBoard)
        io.to(data.boardId).emit(SocketEventsEnum.boardsUpdated, updatedBoard)
    }catch(err){
        socket.emit(SocketEventsEnum.boardsNotUpdated, getError(err))
    }
}


export const deleteBoard = async (io: Server, socket: Socket, data: { boardId: string}) => {
    try{
        if(!socket.user){
            socket.emit(SocketEventsEnum.boardsNotDeleted, 'no board id')
            return
        }

        await BoardModel.deleteOne({_id: data.boardId})

        io.to(data.boardId).emit(SocketEventsEnum.boardsDeleted)

    }catch(err){
        socket.emit(SocketEventsEnum.boardsNotDeleted, getError(err))
    }
}
