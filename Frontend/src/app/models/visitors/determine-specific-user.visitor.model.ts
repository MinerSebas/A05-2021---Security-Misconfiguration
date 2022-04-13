import { Admin } from "../admin.model";
import { User } from "../user.model";
import { Visitor } from "./visitor.model";

export class DetermineSpecificUserVisitor implements Visitor{
    constructor(){
        this.identifier = "";
    }

    public identifier: string;

    visit(user: User): void;
    visit(admin: Admin): void;
    visit(meta: any): void {
       if (meta instanceof User){
           this.identifier = "User";
       }

       if (meta instanceof Admin){
           this.identifier = "Admin";
       }
    }
}