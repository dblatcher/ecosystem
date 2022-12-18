import { Animal } from "../abstract-entities/Animal";
import { Berry } from "./Berry";
import { Mould } from "./Mould";
import { Organic } from "../abstract-entities/Organic";
import {
  searchInOneRandomDirection,
  pickNearestFoodInSightAndKeepItAsTarget,
} from "../traits/search";

export class Bug extends Animal {
  ENTITY_TYPE_ID = "Bug";
  observationRange = 10;
  corpseEnergy = 2;
  foodTypes = [Berry, Mould];

  searchForFood = searchInOneRandomDirection(this);
  chooseFoodTarget = pickNearestFoodInSightAndKeepItAsTarget(this);

  act() {
    const diedOfStarvation = this.starve();
    if (diedOfStarvation) {
      return;
    }

    const thingsICanSee = this.observe();
    this.chooseFoodTarget(thingsICanSee);
    const food = this.findExistingFoodTargetFrom(thingsICanSee);

    if (food) {
      this.lastAction = "approach and eat";
      return this.approachAndEat(food as Organic);
    } else {
      this.lastAction = "search for food";
      return this.searchForFood();
    }
  }
}
