import {
  Direction,
  getDistance,
  getDirectionTo,
  displace,
  Position,
} from "../positions";
import { Organic, OrganicData } from "./Organic";
import { Corpse } from "../entity-types/Corpse";
import { Entity } from "../Entity";

export type Target = {
  entityType: string;
  position: Position;
};

export type AnimalData = OrganicData & {
  direction?: Direction;
  target?: Target;
};

export abstract class Animal extends Organic {
  data: AnimalData;
  ENTITY_TYPE_ID = "Animal";
  observationRange = 2;
  corpseEnergy = 1;
  foodTypes: typeof Organic[] = [];

  constructor(data: AnimalData, id?: string) {
    super(data, id);
    this.data = data;
  }

  abstract chooseFoodTarget(thingsICanSee: Entity[]): Target | undefined;

  die(customMessage?: string) {
    return this.changeTo(
      new Corpse(
        {
          ...this.data,
          energy: this.data.energy + this.corpseEnergy,
          animalType: this.ENTITY_TYPE_ID,
        },
        this.id
      ),
      customMessage
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
      this.report(
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

  /**
   * Match the animal's target to a list of entities.
   *
   * NOTE - test is very crude and assumes the target cannot move!
   *
   * @param entities a list of entities
   * @returns the entity in the list matching this Animal's target, or undefined
   */
  findExistingTargetFrom(entities: Entity[]): Entity | undefined {
    const { target } = this.data;
    return target
      ? entities.find(
          (thing) =>
            thing.ENTITY_TYPE_ID === target.entityType &&
            getDistance(target.position, thing.data.position) === 0
        )
      : undefined;
  }

  eatWhole(entity: Organic) {
    this.data.energy += entity.data.energy;
    entity.leave(
      `${this.description} ate ${entity.description} and gained ${entity.data.energy} energy. E:${this.data.energy}`
    );
  }

  moveBy(direction: Direction, speed = 1) {
    this.data.position = displace(this.data.position, direction, speed);
  }

  moveTowards(entity: Entity, speed = 1) {
    // TO DO - prop path finding!
    const distance = getDistance(this.data.position, entity.data.position);
    const direction = getDirectionTo(this.data.position, entity.data.position);
    return this.moveBy(direction, Math.min(speed, Math.floor(distance)));
  }

  approachAndEat(food: Organic, speed = 1) {
    this.data.direction = undefined;
    const distance = getDistance(food.data.position, this.data.position);

    if (distance > 1) {
      this.report(
        `${this.description} moving towards ${
          food.description
        }, ${distance.toFixed(4)} away`
      );
      return this.moveTowards(food, speed);
    }

    return this.eatWhole(food);
  }

  starve(): boolean {
    this.data.energy--;

    if (this.data.energy <= 0) {
      this.die(`Oh no! ${this.description} has starved!`);
      return true;
    }
    return false;
  }
}
