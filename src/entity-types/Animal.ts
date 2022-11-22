import { getDistance } from "../baseTypes";
import { Entity, EntityData } from "../Entity";
import { Corpse } from "./Corpse";
import { Mould } from "./Mould";

export type AnimalData = EntityData & {
  energy: number;
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

  observe(): Entity[] {
    const { environment, observationRange } = this;
    if (!environment || !observationRange) {
      return [];
    }

    return environment.entities
      .filter((entity) => entity !== this)
      .filter(
        (entity) =>
          getDistance(entity.data.position, this.data.position) <=
          observationRange
      );
  }

  eatWhole(entity: Mould) {
    this.data.energy += entity.data.energy;
    entity.leave(
      `${this.description} ate ${entity.description} and gained ${entity.data.energy} energy. E:${this.data.energy}`
    );
  }

  // To do - generalise movement to not be x,y
  moveBy(x: number, y: number) {
    this.data.position.x += x;
    this.data.position.y += y;
  }

  moveTowards(entity: Entity) {
    // TO DO - prop path finding!
    const { x, y } = this.data.position;

    if (entity.data.position.x > x) {
      return this.moveBy(1, 0);
    } else if (entity.data.position.x < x) {
      return this.moveBy(-1, 0);
    } else if (entity.data.position.y > y) {
      return this.moveBy(0, 1);
    } else if (entity.data.position.y < y) {
      return this.moveBy(0, -1);
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

export class Bug extends Animal {
  ENTITY_TYPE_ID = "Bug";
  observationRange = 10;

  act() {
    this.data.energy--;

    if (this.data.energy <= 0) {
      return this.starve();
    } else {
      const inSight = this.observe();
      this.environment?.log(
        `${this.description} can see: ${inSight
          .map((e) => `\n - ${e.description}`)
          .join()}`
      );

      const foodInSight = inSight
        .filter((e) => e instanceof Mould)
        .sort(
          (a, b) =>
            getDistance(b.data.position, this.data.position) -
            getDistance(a.data.position, this.data.position)
        ) as Mould[];

      const nearestFood: Mould | undefined = foodInSight[0];

      if (nearestFood) {
        const distance = getDistance(
          nearestFood.data.position,
          this.data.position
        );

        if (distance > 1) {
          this.environment?.log(
            `${this.description} moving towards ${nearestFood.description}`
          );
          return this.moveTowards(nearestFood);
        }

        return this.eatWhole(nearestFood);
      }

      this.environment?.log(
        `${this.description} saw no food and waited. E:${this.data.energy}`
      );
    }
  }
}
