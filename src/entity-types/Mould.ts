import {
  describeDirection,
  describePosition,
  getRandomDirection,
  Position,
  positionExists,
  positionsMatch,
} from "../positions";
import { Organic, OrganicData } from "../abstract-entities/Organic";

export class Mould extends Organic {
  ENTITY_TYPE_ID = "Mould";
  data: OrganicData;

  constructor(data: OrganicData, id?: string) {
    super(data, id);
    this.data = data;
  }

  act() {
    this.data.energy++;

    if (this.data.energy > 5) {
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
        this.report(
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
      this.report(
        `${this.description} sent a spore off the edge of the world.`
      );
    }
  }
}
