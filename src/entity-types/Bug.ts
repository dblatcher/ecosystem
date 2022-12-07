import { Entity } from "../Entity";
import {
  describeDirection,
  getDistance,
  getRandomDirection,
} from "../positions";
import { Animal, Target } from "../abstract-entities/Animal";
import { Berry } from "./Berry";
import { Mould } from "./Mould";
import { Organic } from "../abstract-entities/Organic";

export class Bug extends Animal {
  ENTITY_TYPE_ID = "Bug";
  observationRange = 10;
  corpseEnergy = 2;
  foodTypes = [Berry, Mould];

  searchForFood() {
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

  act() {
    const diedOfStarvation = this.starve();
    if (diedOfStarvation) {
      return;
    }

    const thingsICanSee = this.observe();
    this.chooseFoodTarget(thingsICanSee);
    const food = this.findExistingTargetFrom(thingsICanSee);

    if (food) {
      return this.approachAndEat(food as Organic);
    } else {
      return this.searchForFood();
    }
  }
}
