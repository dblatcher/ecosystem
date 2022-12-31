import { Animal } from "../abstract-entities/Animal";
import {
  AnimalWithMemory,
  AnimalWithMemoryData,
} from "../abstract-entities/AnimalWithMemory";
import { Egg } from "../abstract-entities/Egg";
import { Organic } from "../abstract-entities/Organic";
import { Seed } from "../abstract-entities/Seed";
import { Entity } from "../abstract-entities/Entity";
import { Action } from "../constants";
import { getRandomDirection, positionsMatch } from "../positions";
import { manageFatLevel, FatManagementPlan } from "../traits/digestion";
import {
  pickNearestFoodInMemoryAndKeepItAsTarget,
  searchInOneRandomDirection,
} from "../traits/search";
import { manageSleeping } from "../traits/sleep";

export type ChickenData = AnimalWithMemoryData & {
  fat: number;
  isAsleep: boolean;
  sleepDebt: number;
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
      isAsleep: false,
      sleepDebt: 0,
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
  costToLayEgg = 25;
  baseEnergyUse = 0;

  constructor(data: ChickenData, id?: string) {
    super(data, id);
    this.data = data;
  }

  get feelsSafe(): boolean {
    //TO DO - check for nearest preditor in memory
    return Math.random() > 0.75;
  }

  searchForFood = searchInOneRandomDirection(this);
  chooseFoodTarget = pickNearestFoodInMemoryAndKeepItAsTarget(this);
  manageFat = manageFatLevel(this);
  manageSleep = manageSleeping(this);

  feed(thingsICanSee: Entity[]) {
    const target = this.chooseFoodTarget();
    const foodTargetEntity = this.findExistingFoodTargetFrom(thingsICanSee);

    if (foodTargetEntity) {
      this.lastAction = Action.goToFood;
      return this.approachAndEat(foodTargetEntity as Organic, 2);
    } else if (target) {
      this.lastAction = Action.goToFood;
      return this.moveTowards(target, 2);
    } else {
      this.lastAction = Action.searchForFood;
      return this.searchForFood();
    }
  }

  // TO DO - gestation process
  // TO DO - mating + fertilized eggs
  layEgg() {
    const { environment } = this;
    if (!environment) {
      return;
    }
    this.data.energy -= this.costToLayEgg;

    const egg = new EggOfChicken({
      position: this.data.position,
      energy: this.costToLayEgg,
      timeToHatch: 10,
    });

    egg.join(environment, undefined, `${this.description} laid an egg!`);
    this.lastAction = Action.layEgg;
  }

  act() {
    this.manageFat(plan);
    this.manageSleep({});

    const diedOfStarvation = this.starve();
    if (diedOfStarvation) {
      return;
    }

    if (this.data.isAsleep) {
      this.lastAction = Action.sleep
      this.report(`${this.description} is asleep, sleepDebt = ${this.data.sleepDebt}`)
      return
    }

    const thingsICanSee = this.observe();

    if (
      this.data.fat < 10 ||
      this.data.energy < this.costToLayEgg + plan.minimalEnergyLevel
    ) {
      return this.feed(thingsICanSee);
    } else if (this.feelsSafe) {
      return this.layEgg();
    } else {
      this.lastAction = Action.wander;
      return this.moveBy(getRandomDirection(), 1);
    }
  }
}
