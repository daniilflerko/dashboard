import { NextFunction, Request, Response } from "express";
import UserModel from "../models/user"
import { UserDocument } from "../types/user.interface";
import { Error } from "mongoose";
import jwt from "jsonwebtoken";
import { privateKey } from "../config";
import { RequestInterface } from "../types/request.interface";
 

const normalizeUser = (user: UserDocument) => {
    const token = jwt.sign({id:user.id, email: user.email}, privateKey); //generates a token that is just a string
    return {
        email: user.email,
        username: user.username,
        id: user.id,
        token: `Bearer ${token}`
    };
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const newUser = new UserModel({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });
        console.log('new User', newUser)

        const savedUser = await newUser.save();
        console.log('savedUser', savedUser);
        res.send(normalizeUser(savedUser));
    } catch(err) {
        if(err instanceof Error.ValidationError){
            const messages = Object.values(err.errors).map(err => err.message);
            return res.status(420).json(messages);
        }
        next(err);
    };
}


export const login = async (req: Request, res: Response, next: NextFunction) => {
    try{
       const user = await UserModel.findOne({email: req.body.email}).select('+password');
       const errors = {emailOrPassword: 'Incorrect email or password.'};
       if(!user){
        return res.status(420).json(errors);
       }

       const isPassword = await user.validatePassword(req.body.password);
       if(!isPassword){
        return res.status(420).json(errors);
       }

       res.send(normalizeUser(user))
    } catch(err) {
        next(err);
    }
}

export const currentUser = (req: RequestInterface, res: Response) => {
    if(!req.user){
        return res.sendStatus(401);
    }
    res.send(normalizeUser(req.user));
}