import {
  Direction,
  getDistance,
  getDirectionTo,
  displace,
  Position,
} from "../positions";
import { Entity, EntityData } from "../Entity";
import { Corpse } from "./Corpse";
import { Mould } from "./Mould";

export type Target = {
  entityType: string;
  position: Position;
};

export type AnimalData = EntityData & {
  energy: number;
  direction?: Direction;
  target?: Target;
};

export abstract class Animal extends Entity {
  data: AnimalData;
  ENTITY_TYPE_ID = "Animal";
  observationRange = 2;

  constructor(data: AnimalData, id?: string) {
    super(data, id);
    this.data = data;
  }

  starve() {
    return this.changeTo(
      new Corpse({ ...this.data, animalType: this.ENTITY_TYPE_ID }, this.id),
      `Oh no! ${this.description} has starved!`
    );
  }

  observe(report = false): Entity[] {
    const { environment, observationRange } = this;
    if (!environment || !observationRange) {
      return [];
    }

    const inSight = environment.entities
      .filter((entity) => entity !== this)
      .filter(
        (entity) =>
          getDistance(entity.data.position, this.data.position) <=
          observationRange
      );

    if (report) {
      this.environment?.log(
        `${this.description} can see: ${inSight
          .map((e) => `\n - ${e.description}`)
          .join()}`
      );
    }

    return inSight;
  }

  setTarget(entity: Entity): Target {
    const target = {
      position: entity.data.position,
      entityType: entity.ENTITY_TYPE_ID,
    };
    this.data.target = target;
    return target;
  }

  matchTarget(entities: Entity[]): Entity | undefined {
    const { target } = this.data;
    return target
      ? entities.find(
          (thing) =>
            thing.ENTITY_TYPE_ID === target.entityType &&
            getDistance(target.position, thing.data.position) === 0
        )
      : undefined;
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

  eatWhole(entity: Mould) {
    this.data.energy += entity.data.energy;
    entity.leave(
      `${this.description} ate ${entity.description} and gained ${entity.data.energy} energy. E:${this.data.energy}`
    );
  }

  moveBy(direction: Direction) {
    this.data.position = displace(this.data.position, direction, 1);
  }

  moveTowards(entity: Entity) {
    // TO DO - prop path finding!
    const direction = getDirectionTo(this.data.position, entity.data.position);
    return this.moveBy(direction);
  }

  act() {
    this.data.energy--;

    if (this.data.energy <= 0) {
      return this.starve();
    } else {
      this.environment?.log(
        `${this.description} was at rest. E:${this.data.energy}`
      );
    }
  }
}
