import {
  Direction,
  getDistance,
  getDirectionTo,
  displace,
  Position,
} from "../positions";
import { Organic, OrganicData } from "./Organic";
import { Corpse } from "./Corpse";
import { Mould } from "./Mould";
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

  constructor(data: AnimalData, id?: string) {
    super(data, id);
    this.data = data;
  }

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

  starve():boolean {
    this.data.energy--;

    if (this.data.energy <= 0) {
      this.die(`Oh no! ${this.description} has starved!`);
      return true
    } 
    return false
  }
}
