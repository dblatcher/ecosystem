import { Animal } from "../abstract-entities/Animal";
import { Plant } from "../abstract-entities/Plant";
import { Entity } from "../Entity";
import { Position, positionsMatch } from "../positions";

export type MentalEntity = {
  entityType: string;
  data: {
    position: Position;
  };
};

export const entityToMentalEntity = (entity: Entity): MentalEntity => {
  return {
    entityType: entity.ENTITY_TYPE_ID,
    data: { position: entity.data.position },
  };
};

export const mentalEntitiesMatch = (
  a: MentalEntity,
  b: MentalEntity
): boolean => {
  return (
    a.entityType === b.entityType &&
    positionsMatch(a.data.position, b.data.position)
  );
};
