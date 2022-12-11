import { describePosition } from "../positions";
import { OrganicData, Organic } from "./Organic";
import type { Plant } from "./Plant";

export interface SeedData extends OrganicData {
  timeToGerminate: number;
}

export abstract class Seed extends Organic {
  data: SeedData;
  abstract SeedOf: typeof Plant;

  constructor(data: SeedData, id?: string) {
    super(data, id);
    this.data = data;
  }

  abstract makeNewPlant(): Plant;

  germinate() {
    if (this.data.timeToGerminate-- <= 0) {
      const message = `${this.ENTITY_TYPE_ID} at ${describePosition(
        this.data.position
      )} has germinated into a plant.`;
      this.changeTo(this.makeNewPlant(), message);
    }
  }

  act(): void {
    this.germinate();
  }
}
