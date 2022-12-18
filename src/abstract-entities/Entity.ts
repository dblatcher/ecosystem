import {
  describePosition,
  getDistance,
  Position,
  positionExists,
} from "../positions";
import { Environment } from "../Environment";
import { Action, actionToString } from "../constants";

export type EntityData = {
  position: Position;
};

export abstract class Entity {
  data: EntityData;
  id?: string;
  ENTITY_TYPE_ID = "Entity";
  environment?: Environment;
  protected lastAction?: Action;

  constructor(data: EntityData, id?: string) {
    this.data = data;
    this.id = id;
  }

  get description(): string {
    const { ENTITY_TYPE_ID, id } = this;
    const place = describePosition(this.data.position);
    return id
      ? `${id} the ${ENTITY_TYPE_ID}${place}`
      : `${ENTITY_TYPE_ID}${place}`;
  }

  get action(): string {
    return typeof this.lastAction === "undefined"
      ? ""
      : actionToString(this.lastAction);
  }

  findNearestMatch(
    test: { (entity: Entity): boolean },
    entities: Entity[]
  ): Entity | undefined {
    const matches = entities
      .filter(test)
      .sort(
        (a, b) =>
          getDistance(a.data.position, this.data.position) -
          getDistance(b.data.position, this.data.position)
      );
    return matches[0];
  }

  findNearestOfClass(
    inSight: Entity[],
    EntityClasses: typeof Entity | Array<typeof Entity>
  ): undefined | Entity {
    const listOfClasses = Array.isArray(EntityClasses)
      ? EntityClasses
      : [EntityClasses];
    return this.findNearestMatch(
      (entity) =>
        listOfClasses.some((EntityClass) => entity instanceof EntityClass),
      inSight
    );
  }

  join(
    environment: Environment,
    newPosition?: Position,
    customMessage?: string
  ) {
    if (this.environment) {
      this.leave();
    }

    const position = newPosition || this.data.position;
    if (!positionExists(position, environment.data.space)) {
      this.report(
        `${this.description} cannot join at ${describePosition(
          position
        )} as that place does not exist.`
      );
      return;
    }

    environment.entities.push(this);
    this.environment = environment;
    this.data.position = position;
    this.report(customMessage || `${this.description} has joined.`);
  }

  leave(customMessage?: string) {
    const { environment } = this;
    if (!environment) {
      return;
    }
    const index = environment.entities.indexOf(this);
    if (index === -1) {
      return;
    }
    environment.entities.splice(index, 1);
    this.report(customMessage || `${this.description} has left.`);
    this.environment = undefined;
  }

  changeTo(newEntity: Entity, customMessage?: string) {
    const { environment } = this;
    if (!environment) {
      return;
    }
    const index = environment.entities.indexOf(this);
    if (index === -1) {
      return;
    }
    environment.entities.splice(index, 1, newEntity);
    newEntity.environment = environment;

    // have to call report before removing environment from the original Entity
    this.report(
      customMessage || `${this.description} changed to ${newEntity.description}`
    );
    this.environment = undefined;
  }

  report(message: string) {
    return this.environment?.receiveReport({ message, from: this });
  }

  act() {
    this.lastAction = undefined;
  }
}
