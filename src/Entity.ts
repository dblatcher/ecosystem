import { describePosition, Position, positionExists } from "./baseTypes";
import { Environment } from "./Environment";

export type EntityData = {
  position: Position;
};

export abstract class Entity {
  data: EntityData;
  id?: string;
  ENTITY_TYPE_ID = "Entity";
  environment?: Environment;

  constructor(data: EntityData, id?: string) {
    this.data = data;
    this.id = id;
  }

  get description(): string {
    return `${this.ENTITY_TYPE_ID} ${this.id || ""}${describePosition(
      this.data.position
    )}`;
  }

  join(environment: Environment, newPosition?: Position) {
    if (this.environment) {
      this.leave();
    }

    const position = newPosition || this.data.position;
    if (!positionExists(position, environment.data.space)) {
      environment.log(
        `${this.description} cannot join at ${describePosition(
          position
        )} as that place does not exist.`
      );
      return;
    }

    environment.entities.push(this);
    this.environment = environment;
    this.data.position = position;
    this.environment.log(`${this.description} has joined.`);
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
    this.environment = undefined;
    environment.log(customMessage || `${this.description} has left.`);
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
    this.environment = undefined;
    environment.log(
      customMessage || `${this.description} changed to ${newEntity.description}`
    );
  }

  act() {
    this.environment?.log(`${this.description} did nothing.`);
  }
}
