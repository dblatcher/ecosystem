import { AnimalWithMemory } from "../abstract-entities/AnimalWithMemory";
import { Organic } from "../abstract-entities/Organic";
import { Seed } from "../abstract-entities/Seed";
import { pickNearestFoodInMemoryAndKeepItAsTarget, searchInOneRandomDirection } from "../traits/animal-traits";

export class Chicken extends AnimalWithMemory {

  ENTITY_TYPE_ID = "Chicken";
  corpseEnergy = 50;
  foodTypes = [Seed];
  observationRange = 4;

  searchForFood = searchInOneRandomDirection(this);
  chooseFoodTarget = pickNearestFoodInMemoryAndKeepItAsTarget(this);

  act() {
    const diedOfStarvation = this.starve();
    if (diedOfStarvation) {
      return;
    }

    const thingsICanSee = this.observe();

    const target = this.chooseFoodTarget();
    const foodTargetEntity = this.findExistingTargetFrom(thingsICanSee);

    if (foodTargetEntity) {
      return this.approachAndEat(foodTargetEntity as Organic, 2);
    } else if (target) {
      return this.moveTowards(target, 2);
    } else {
      return this.searchForFood();
    }
  }
}
