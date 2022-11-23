import {
  describeDirection,
  describePosition,
  getRandomDirection,
  Position,
  positionExists,
  positionsMatch,
} from "../baseTypes";
import { Entity, EntityData } from "../Entity";

type MouldData = EntityData & {
  energy: number;
};

export class Mould extends Entity {
  ENTITY_TYPE_ID = "Mould";
  data: MouldData;

  constructor(data: MouldData, id?: string) {
    super(data, id);
    this.data = data;
  }

  act() {
    this.data.energy++;

    if (this.data.energy <= 0) {
      this.leave(`Oh no! ${this.description} has starved!`);
    } else if (this.data.energy > 5) {
      return this.reproduce();
    }
  }

  reproduce() {
    const { environment } = this;
    if (!environment) {
      return;
    }
    const { x, y } = this.data.position;
    const direction = getRandomDirection();

    const positionForNewMould: Position = {
      x: x + direction.x,
      y: y + direction.y,
    };

    this.data.energy -= 5;
    if (positionExists(positionForNewMould, environment.data.space)) {
      const otherEntity = environment.entities.find((entity) =>
        positionsMatch(positionForNewMould, entity.data.position)
      );

      if (otherEntity) {
        environment.log(
          `${this.description} sent a spore to ${describeDirection(
            direction
          )} but ${otherEntity.description} was already there.`
        );
      } else {
        new Mould({ position: positionForNewMould, energy: 1 }).join(
          environment,
          undefined,
          `${this.description} created a new mould at ${describePosition(
            positionForNewMould
          )}.`
        );
      }
    } else {
      environment.log(
        `${this.description} sent a spore off the edge of the world.`
      );
    }
  }
}
