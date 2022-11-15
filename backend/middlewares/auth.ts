import { Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { privateKey } from "../config";
import UserModel from '../models/user'
import { RequestInterface } from "../types/request.interface";

export default async (req: RequestInterface, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.sendStatus(401);
        }

        const token = authHeader.split(' ')[1];
        const data = jwt.verify(token, privateKey) as {id: string; email: string};
        const user = await UserModel.findById(data.id);
        if(!user){
            return res.sendStatus(401);
        }
        req.user = user;
        next();

    } catch(err) {
        res.sendStatus(401)
    }
}