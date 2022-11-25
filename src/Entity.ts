import { describePosition, getDistance, Position, positionExists } from "./positions";
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
    const { ENTITY_TYPE_ID, id } = this;
    const place = describePosition(this.data.position);
    return id
      ? `${id} the ${ENTITY_TYPE_ID}${place}`
      : `${ENTITY_TYPE_ID}${place}`;
  }


  findNearestMatch(
    test: { (entity: Entity): boolean },
    entities: Entity[]
  ): Entity | undefined {
    const matches = entities
      .filter(test)
      .sort(
        (a, b) =>
          getDistance(b.data.position, this.data.position) -
          getDistance(a.data.position, this.data.position)
      );
    return matches[0];
  }

  findNearestOfClass(
    inSight: Entity[],
    EntityClass: typeof Entity
  ): undefined | Entity {
    return this.findNearestMatch(
      (entity) => entity instanceof EntityClass,
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
    this.environment.log(customMessage || `${this.description} has joined.`);
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

  act() {}
}
