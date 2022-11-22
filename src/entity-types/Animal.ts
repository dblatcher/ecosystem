import {
  describePosition,
  Position,
  positionExists,
  positionsMatch,
} from "../baseTypes";
import { Entity, EntityData } from "../Entity";

export type AnimalData = EntityData & {
  energy: number;
};

export abstract class Animal extends Entity {
  ENTITY_TYPE_ID = "Animal";
  data: AnimalData;

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
}

export type CorpseData = EntityData & {
  animalType: string;
};
export class Corpse extends Entity {
  ENTITY_TYPE_ID = "Corpse";
  data: CorpseData;
  constructor(data: CorpseData, id?: string) {
    super(data, id);
    this.data = data;
  }

  get description() {
    const place = describePosition(this.data.position);
    return this.id
      ? `The Corpse of ${this.id} the ${this.data.animalType}${place}`
      : `A ${this.data.animalType} corpse${place} `;
  }
}
