import { MetaUser } from "./meta-user.model";
import { Visitor } from "./visitors/visitor.model";

export class User implements MetaUser {
    constructor(){
      this.personId = "";
      this.userName = "";
      this.passWord = "";
    }
    personId: string;
    userName: string;
    passWord: string;

    public acceptVisitor(visitor: Visitor): void {
      visitor.visit(this);
  }
  }