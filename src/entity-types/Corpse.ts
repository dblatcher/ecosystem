import { describePosition } from "../positions";
import { EntityData, Entity } from "../Entity";

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
        : `A ${this.data.animalType} corpse${place}`;
    }
  }
  