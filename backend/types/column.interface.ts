import { Schema, Document } from "mongoose";

export interface Column {
    title: string;
    description: string;
    createdAt: Date;
    userId: Schema.Types.ObjectId;
    boardId: Schema.Types.ObjectId
}

export interface ColumnDocument extends Document, Column {}