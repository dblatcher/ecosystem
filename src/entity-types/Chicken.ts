import { Animal } from "../abstract-entities/Animal";
import { Organic } from "../abstract-entities/Organic";
import { Seed } from "../abstract-entities/Seed";
import { getRandomDirection, describeDirection, getDistance } from "../positions";

export class Chicken extends Animal {
  ENTITY_TYPE_ID = "Chicken";
  corpseEnergy = 50;
  foodTypes = [Seed];
  observationRange = 10;

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
    this.chooseFoodTarget(thingsICanSee);
    const food = this.matchTarget(thingsICanSee);

    if (food) {
      return this.hunt(food as Organic);
    } else {
      return this.search();
    }
  }

}
