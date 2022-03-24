import { inject, injectable } from "inversify";
import { controller, httpGet, httpPut, interfaces, queryParam } from "inversify-express-utils";
import { DatabaseService } from "../../core/services/database.service";
import { Request, Response } from 'express';
import { Actor } from "../../models/actor.model";
import { ActorsService } from "../../core/services/actors.service";
import { ChangeActorData } from "../../models/change-actor-data.model";

@controller('/actors')
@injectable()
export class ActorsController implements interfaces.Controller{
    constructor(
        @inject(DatabaseService.name) private databaseService: DatabaseService,
        @inject(ActorsService.name) private actorsService: ActorsService
      ) {}

    @httpGet('/lookup')
    public async getActorsByOwnerID(@queryParam('ownerId') ownerId: string, request: Request, response: Response): Promise<void> {
      if (ownerId == 'undefined' || ownerId == null) {
        return response.status(400).json({ error: 'The owner ID was not defined!' });
      }
  
      this.databaseService.getActorsByOwnerId(ownerId).then((result: Array<Actor>) => {
        return response.status(200).json(result);
      });
    }

    @httpPut('/:id')
    public async updateExistingActor(request: Request, response: Response): Promise<void> {
      try {
          if (!this.actorsService.isActorValid(request.body)) {
            return response.status(400).json({ error: this.actorsService.errorMessage });
          }
    
          if (request.body.id != request.params.id) {
            return response.status(400).json({
              error: 'The ID of the actor does not match the ID in the parameters!'
            });
          }
    
          var actors = await this.databaseService.getActorsById(request.body.id);
    
          if (!this.actorsService.doActorsBelongToOwner(actors, request.body.ownerId)) {
            return response.status(401).json({
              error: `The given actor with ID ${request.body.id} does not belong to the owner ${request.body.ownerId}!`
            });
          }
    
          let updatedActor = await this.databaseService.updateActor(request.params.id, request.body);
          return response.status(201).json(updatedActor);
        } catch (err) {
          return response.status(400).json({ error: err.message });
        }
    }
}