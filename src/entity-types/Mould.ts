import {
  describePosition,
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
    } else {
      this.environment?.log(
        `${this.description} was at rest. E:${this.data.energy}`
      );
    }
  }

  reproduce() {
    const { environment } = this;
    if (!environment) {
      return;
    }
    const { x, y } = this.data.position;
    const random = Math.floor(Math.random() * 4);
    const positionForNewMould: Position = [
      { x: x - 1, y: y },
      { x: x + 1, y: y },
      { x: x, y: y - 1 },
      { x: x, y: y + 1 },
    ][random];

    this.data.energy -= 5;
    if (positionExists(positionForNewMould, environment.data.space)) {
      const otherEntity = environment.entities.find((entity) =>
        positionsMatch(positionForNewMould, entity.data.position)
      );

      if (otherEntity) {
        environment.log(
          `${this.description} sent a spore to ${describePosition(
            positionForNewMould
          )} but ${otherEntity.description} was already there.`
        );
      } else {
        environment.log(
          `${this.description} created a new mould at ${describePosition(
            positionForNewMould
          )}.`
        );
        new Mould({ position: positionForNewMould, energy: 1 }).join(
          environment
        );
      }
    } else {
      environment.log(
        `${this.description} sent a spore off the edge of the world.`
      );
    }
  }
}
