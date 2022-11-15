import { Schema, Document } from "mongoose";

export interface Board {
    title: string;
    description: string;
    createdAt: Date;
    userId: Schema.Types.ObjectId
}

export interface BoardDocument extends Document, Board {}