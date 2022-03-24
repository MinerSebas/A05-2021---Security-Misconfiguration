import { Actor } from "./actor.model";
import { MetaUser } from "./meta-user.model";

export interface ChangeActorData{
    actor: Actor;
    user: MetaUser;
    role: string;
}