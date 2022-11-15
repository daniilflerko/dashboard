import { NextFunction, Response } from "express";
import { RequestInterface } from "../types/request.interface";
import { Server } from "socket.io";
import { Socket } from "../types/socket.interface";
import { SocketEventsEnum } from "../types/socketEvents.enum";
import { getError } from "../shared";
import ColumnModel from "../models/column";

export const getColumns = async (req: RequestInterface ,res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const columns = await ColumnModel.find({ boardId: req.params.boardId });
    res.send(columns);
  } catch (err) {
    next(err);
  }
};

export const createColumn = async (
  io: Server,
  socket: Socket,
  data: { boardId: string; title: string }
) => {
  try {
    if (!socket.user) {
      socket.emit(
        SocketEventsEnum.columnsNotCreated,
        "User is not authorized"
      );
      return;
    }
    const newColumn = new ColumnModel({
      title: data.title,
      boardId: data.boardId,
      userId: socket.user.id,
    });
    const savedColumn = await newColumn.save();
    io.to(data.boardId).emit(
      SocketEventsEnum.columnsCreated,
      savedColumn
    ); 
    console.log("savedColumn", savedColumn);
  } catch (err) {
    socket.emit(SocketEventsEnum.columnsNotCreated, getError(err));
  }
};


export const deleteColumn = async (io: Server, socket: Socket, data: { boardId: string, columnId: string}) => {
  try{
      if(!socket.user){
          socket.emit(SocketEventsEnum.columnsNotDeleted, 'no column id')
          return
      }

      await ColumnModel.deleteOne({_id: data.columnId})

      io.to(data.boardId).emit(SocketEventsEnum.columnsDeleted, data.columnId)

  }catch(err){
      socket.emit(SocketEventsEnum.columnsNotDeleted, getError(err))
  }
}
