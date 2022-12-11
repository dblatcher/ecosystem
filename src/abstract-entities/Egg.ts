import { describePosition } from "../positions";
import { Animal } from "./Animal";
import { OrganicData, Organic } from "./Organic";

export interface EggData extends OrganicData {
  timeToHatch: number;
  isDead?: boolean;
}

export abstract class Egg extends Organic {
  data: EggData;
  abstract EggOf: typeof Animal;
  abstract needsIncubating: boolean;

  constructor(data: EggData, id?: string) {
    super(data, id);
    this.data = data;
  }

  abstract makeNewAnimal(): Animal;
  abstract isBeingIncubated(): boolean;

  develop() {
    if (this.needsIncubating && !this.isBeingIncubated()) {
      return;
    }

    if (this.data.timeToHatch-- <= 0) {
      this.hatch();
    }
  }

  hatch() {
    const message = `${this.ENTITY_TYPE_ID} at ${describePosition(
      this.data.position
    )} has hatched into an animal.`;
    return this.changeTo(this.makeNewAnimal(), message);
  }

  act(): void {
    if (!this.data.isDead) {
      this.develop();
    }
  }
}
