import { Animal } from "../abstract-entities/Animal";
import { Organic } from "../abstract-entities/Organic";
import { Seed } from "../abstract-entities/Seed";
import { pickNearestFoodAndKeepItAsTarget, searchInOneRandomDirection } from "../traits/animal-traits";

export class Chicken extends Animal {
  ENTITY_TYPE_ID = "Chicken";
  corpseEnergy = 50;
  foodTypes = [Seed];
  observationRange = 10;

  searchForFood = searchInOneRandomDirection(this);
  chooseFoodTarget = pickNearestFoodAndKeepItAsTarget(this);

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
