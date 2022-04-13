import { Visitor } from "./visitors/visitor.model";

export interface MetaUser{
    personId: string;
    userName: string;
    passWord: string;
    acceptVisitor(visitor: Visitor) : void;
}