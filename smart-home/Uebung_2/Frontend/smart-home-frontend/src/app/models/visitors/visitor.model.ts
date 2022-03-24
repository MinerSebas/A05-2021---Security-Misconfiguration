import { Admin } from "../admin.model";
import { User } from "../user.model";

export interface Visitor{
    visit(user: User) : void;
    visit(admin: Admin) : void;
}