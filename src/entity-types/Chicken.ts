import { Animal } from "../abstract-entities/Animal";
import { Organic } from "../abstract-entities/Organic";
import { Seed } from "../abstract-entities/Seed";
import { getRandomDirection, describeDirection, getDistance } from "../positions";

export class Chicken extends Animal {
  ENTITY_TYPE_ID = "Chicken";
  corpseEnergy = 50;
  foodTypes = [Seed];
  observationRange = 10;

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
    const foodTarget = this.findExistingTargetFrom(thingsICanSee);

    if (foodTarget) {
      return this.approachAndEat(foodTarget as Organic, 2);
    } else {
      return this.searchForFood();
    }
  }

}
