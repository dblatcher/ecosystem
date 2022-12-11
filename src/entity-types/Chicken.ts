import {
  AnimalWithMemory,
  AnimalWithMemoryData,
} from "../abstract-entities/AnimalWithMemory";
import { Organic } from "../abstract-entities/Organic";
import { Seed } from "../abstract-entities/Seed";
import { manageFatLevel, FatManagementPlan } from "../traits/digestion";
import {
  pickNearestFoodInMemoryAndKeepItAsTarget,
  searchInOneRandomDirection,
} from "../traits/search";

export type ChickenData = AnimalWithMemoryData & {
  fat: number;
};

const plan: FatManagementPlan = {
  maxFat: 50,
  minimalEnergyLevel: 10,
  excessEnergyLevel: 20,
};

export class Chicken extends AnimalWithMemory {
  ENTITY_TYPE_ID = "Chicken";
  data: ChickenData;
  corpseEnergy = 50;
  foodTypes = [Seed];
  observationRange = 4;

  constructor(data: ChickenData, id?: string) {
    super(data, id);
    this.data = data;
  }

  searchForFood = searchInOneRandomDirection(this);
  chooseFoodTarget = pickNearestFoodInMemoryAndKeepItAsTarget(this);
  manageFat = manageFatLevel(this);

  act() {
    this.manageFat(plan);
    const diedOfStarvation = this.starve();
    if (diedOfStarvation) {
      return;
    }

    const thingsICanSee = this.observe();

    const target = this.chooseFoodTarget();
    const foodTargetEntity = this.findExistingFoodTargetFrom(thingsICanSee);

    if (foodTargetEntity) {
      return this.approachAndEat(foodTargetEntity as Organic, 2);
    } else if (target) {
      return this.moveTowards(target, 2);
    } else {
      return this.searchForFood();
    }
  }
}
