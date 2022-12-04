import { Entity, EntityData } from "../Entity";

export type OrganicData = EntityData & {
  energy: number;
};

export abstract class Organic extends Entity {
  ENTITY_TYPE_ID = "Organic";
  data: OrganicData;

  constructor(data: OrganicData, id?: string) {
    super(data, id);
    this.data = data;
  }
}
