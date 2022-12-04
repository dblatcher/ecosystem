import { Entity } from "../Entity";
import {
  describeDirection,
  getDistance,
  getRandomDirection,
} from "../positions";
import { Animal, Target } from "./Animal";
import { Berry } from "./Berry";
import { Mould } from "./Mould";
import { Organic } from "./Organic";

export class Bug extends Animal {
  ENTITY_TYPE_ID = "Bug";
  observationRange = 10;
  corpseEnergy = 2;
  static foodTypes = [Berry, Mould];

  chooseTarget(thingsICanSee: Entity[]): Target | undefined {
    const { target } = this.data;

    // Bug already has a target in mind
    if (target) {
      const canStillSeeTarget = thingsICanSee.some(
        (entity) =>
          entity.ENTITY_TYPE_ID === target.entityType &&
          getDistance(target.position, entity.data.position) === 0
      );

      // stick to the same target
      if (canStillSeeTarget) {
        return target;
      }

      // can't see target anymore, so forget about it
      this.data.target = undefined;
    }

    // no target, so look for food
    const nearestFood = this.findNearestOfClass(thingsICanSee, Bug.foodTypes);
    // if there is food, set it as target
    if (nearestFood) {
     return this.setTarget(nearestFood);
    }

    // found no target
    return undefined;
  }

  search() {
    if (!this.data.direction) {
      this.data.direction = getRandomDirection();
      this.report(
        `${this.description} saw no food, so it turned to ${describeDirection(
          this.data.direction
        )}`
      );
    }
    this.moveBy(this.data.direction || { x: 0, y: 0 });
    this.report(
      `${this.description} kept going ${describeDirection(
        this.data.direction
      )} in search of food`
    );
  }

  hunt(food: Organic) {
    this.data.direction = undefined;
    const distance = getDistance(food.data.position, this.data.position);

    if (distance > 1) {
      this.report(
        `${this.description} moving towards ${
          food.description
        }, ${distance.toFixed(4)} away`
      );
      return this.moveTowards(food);
    }

    return this.eatWhole(food);
  }

  act() {
    const diedOfStarvation = this.starve();
    if (diedOfStarvation) {
      return;
    }

    const thingsICanSee = this.observe();
    this.chooseTarget(thingsICanSee);
    const food = this.matchTarget(thingsICanSee);

    if (food) {
      return this.hunt(food as Organic);
    } else {
      return this.search();
    }
  }
}
