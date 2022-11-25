import { Entity } from "../Entity";
import {
  describeDirection,
  getDistance,
  getRandomDirection,
} from "../positions";
import { Animal, Target } from "./Animal";
import { Mould } from "./Mould";

export class Bug extends Animal {
  ENTITY_TYPE_ID = "Bug";
  observationRange = 10;
  corpseEnergy = 2;

  chooseTarget(thingsICanSee: Entity[]): Target | undefined {
    const { target } = this.data;

    if (target) {
      // Bug has a target in mind
      const canStillSeeTarget = thingsICanSee.some(
        (entity) =>
          entity.ENTITY_TYPE_ID === target.entityType &&
          getDistance(target.position, entity.data.position) === 0
      );

      if (canStillSeeTarget) {
        // keep target in mind
        return target;
      }

      // can't see target anymore, so forget about it
      this.data.target = undefined;

      const nearestFood = this.findNearestOfClass(thingsICanSee, Mould);
      if (nearestFood) {
        this.setTarget(nearestFood);
      }
    } else {
      const nearestFood = this.findNearestOfClass(thingsICanSee, Mould);
      if (nearestFood) {
        this.setTarget(nearestFood);
      }
    }

    return this.data.target;
  }

  search() {
    if (!this.data.direction) {
      this.data.direction = getRandomDirection();
      this.environment?.log(
        `${this.description} saw no food, so it turned to ${describeDirection(
          this.data.direction
        )}`
      );
    }
    this.moveBy(this.data.direction || { x: 0, y: 0 });
    this.environment?.log(
      `${this.description} kept going ${describeDirection(
        this.data.direction
      )} in search of food`
    );
  }

  hunt(prey: Mould) {
    this.data.direction = undefined;
    const distance = getDistance(prey.data.position, this.data.position);

    if (distance > 1) {
      this.environment?.log(
        `${this.description} moving towards ${
          prey.description
        }, ${distance.toFixed(4)} away`
      );
      return this.moveTowards(prey);
    }

    return this.eatWhole(prey);
  }

  act() {
    const diedOfStarvation = this.starve();
    if (diedOfStarvation) {
      return;
    }

    const thingsICanSee = this.observe();
    this.chooseTarget(thingsICanSee);
    const prey = this.matchTarget(thingsICanSee);

    if (prey) {
      return this.hunt(prey as Mould);
    } else {
      return this.search();
    }
  }
}
