import { describePosition } from "../positions";
import { Organic, OrganicData } from "../abstract-entities/Organic";

export type CorpseData = OrganicData & {
  animalType: string;
  fat: number;
};
export class Corpse extends Organic {
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
      : `A ${this.data.animalType} corpse${place}`;
  }

  rot() { // to do - does fat rot?
    this.data.energy--;
    if (this.data.energy <= 0) {
      this.leave(`${this.description} has rotted away.`);
    }
  }

  act(): void {
    return this.rot();
  }
}
