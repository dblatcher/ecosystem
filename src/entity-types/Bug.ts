import { Animal } from "../abstract-entities/Animal";
import { Berry } from "./Berry";
import { Mould } from "./Mould";
import { Organic } from "../abstract-entities/Organic";
import { searchInOneRandomDirection } from "../traits/animal-traits";

export class Bug extends Animal {
  ENTITY_TYPE_ID = "Bug";
  observationRange = 10;
  corpseEnergy = 2;
  foodTypes = [Berry, Mould];

  searchForFood = searchInOneRandomDirection(this);

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
