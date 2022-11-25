import { Organic, OrganicData } from "./Organic";

export class Berry extends Organic {
  ENTITY_TYPE_ID = "Berry";
  data: OrganicData;

  constructor(data: OrganicData, id?: string) {
    super(data, id);
    this.data = data;
  }

}
