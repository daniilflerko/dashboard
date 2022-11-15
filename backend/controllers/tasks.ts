import { NextFunction, Response } from "express";
import { RequestInterface } from "../types/request.interface";
import TaskModel from "../models/task"
import { Server } from "socket.io";
import { Socket } from "../types/socket.interface";
import { SocketEventsEnum } from "../types/socketEvents.enum";
import { getError } from "../shared";


export const getTasks = async ( req: RequestInterface, res: Response, next: NextFunction) => {

    try{
        if(!req.user){
        return res.sendStatus(420);
        } 
        const tasks = await TaskModel.find({boardId: req.params.boardId})
        res.send(tasks)
    } catch (err){
        next(err)
    }

}

export const createTask = async( io: Server, socket: Socket, data: {boardId: string, title: string, columnId: string }) => {

    try{
        if(!socket.user) {
            socket.emit( SocketEventsEnum.tasksNotCreated, 'User not authorized')
            return
        }

        const newTask = new TaskModel({
            title: data.title,
            boardId: data.boardId,
            userId: socket.user.id,
            columnId: data.columnId

        })

        const savedTask = await newTask.save()

        io.to(data.boardId).emit(SocketEventsEnum.tasksCreated, savedTask)
    } catch(err) {
        socket.emit(SocketEventsEnum.tasksNotCreated, getError(err))
    }
}



export const deleteTask= async (io: Server, socket: Socket, data: { boardId: string, columnId: string, taskId: string }) => {
    try{
        if(!socket.user){
            socket.emit(SocketEventsEnum.tasksNotDeleted, 'no task')
            return
        }
  
        await TaskModel.deleteOne({_id: data.taskId})
  
        io.to(data.boardId).emit(SocketEventsEnum.tasksDeleted, data.taskId)
  
    }catch(err){
        socket.emit(SocketEventsEnum.tasksNotDeleted, getError(err))
    }
  }
  


  export const updateTask = async (io: Server, socket: Socket, data: { boardId: string, taskId: string, fields: {title?: string, description?: string, columnId?: string} }) => {
    try{
        if(!socket.user){
            socket.emit(SocketEventsEnum.tasksNotUpdated, 'no task')
            return
        }
  
        const updatedTask = await TaskModel.findByIdAndUpdate(data.taskId, data.fields, {new: true})
  
        io.to(data.boardId).emit(SocketEventsEnum.tasksUpdated, updateTask)
  
    }catch(err){
        socket.emit(SocketEventsEnum.tasksNotUpdated, getError(err))
    }
}
  