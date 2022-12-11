import { Animal } from "../abstract-entities/Animal";
import {
  AnimalWithMemory,
  AnimalWithMemoryData,
} from "../abstract-entities/AnimalWithMemory";
import { Egg } from "../abstract-entities/Egg";
import { Organic } from "../abstract-entities/Organic";
import { Seed } from "../abstract-entities/Seed";
import { positionsMatch } from "../positions";
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

export class EggOfChicken extends Egg {
  ENTITY_TYPE_ID = "EggOfChicken";
  EggOf = Chicken;

  isBeingIncubated(): boolean {
    if (!this.environment) {
      return false;
    }
    const { entities } = this.environment;
    return entities
      .filter((entity) => entity instanceof Chicken)
      .some((chicken) =>
        positionsMatch(chicken.data.position, this.data.position)
      );
  }

  needsIncubating = false;

  makeNewAnimal(): Chicken {
    return new this.EggOf({
      position: this.data.position,
      energy: this.data.energy,
      fat: 10,
      memory: [],
    });
  }
}

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
