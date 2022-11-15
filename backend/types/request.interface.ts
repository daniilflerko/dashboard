import { Request } from "express"
import { UserDocument } from "./user.interface"

export interface RequestInterface extends Request {
    user?: UserDocument;
}