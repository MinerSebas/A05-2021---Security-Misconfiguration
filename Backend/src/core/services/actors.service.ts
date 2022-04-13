import { injectable } from "inversify";
import { Actor } from "../../models/actor.model";

@injectable()
export class ActorsService {
    public errorMessage: string;

    public getDefaultActor(ownerId : string) : Actor{
        var actor = {
            ownerId : ownerId,
            valueChange : 0
        } as Actor;

        return actor;
    }

    public isActorValid(actor: Actor) : boolean {
        this.errorMessage = "";
        if (!(actor.valueChange >= 0 && actor.valueChange <= 100)){
            this.errorMessage = "The value change has to lie between 0 and 100!";
            return false;
        }

        return true;
    }

    public doActorsBelongToOwner(actors: Array<Actor>, ownerId: string): boolean {
        if (actors == null || actors == undefined || actors.length == 0) {
          return false;
        }
    
        for (var actor of actors) {
          if (actor.ownerId != ownerId) {
            return false;
          }
        }
    
        return true;
      }
}