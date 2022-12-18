import { Entity } from "../abstract-entities/Entity";
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
