import { Direction, getDistance } from "../baseTypes";
import { Entity, EntityData } from "../Entity";
import { Corpse } from "./Corpse";
import { Mould } from "./Mould";

export type AnimalData = EntityData & {
  energy: number;
  direction?: Direction;
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

  // To do - generalise movement to not be x,y
  moveBy(direction: Direction) {
    this.data.position.x += direction.x;
    this.data.position.y += direction.y;
  }

  moveTowards(entity: Entity) {
    // TO DO - prop path finding!
    const { x, y } = this.data.position;

    if (entity.data.position.x > x) {
      return this.moveBy({ x: 1, y: 0 });
    } else if (entity.data.position.x < x) {
      return this.moveBy({ x: -1, y: 0 });
    } else if (entity.data.position.y > y) {
      return this.moveBy({ x: 0, y: 1 });
    } else if (entity.data.position.y < y) {
      return this.moveBy({ x: 0, y: -1 });
    }
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
