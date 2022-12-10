import { Animal, AnimalData } from "../abstract-entities/Animal";
import { Organic } from "../abstract-entities/Organic";
import { Seed } from "../abstract-entities/Seed";
import { Entity } from "../Entity";
import { describePosition, getDistance } from "../positions";
import { searchInOneRandomDirection } from "../traits/animal-traits";
import {
  entityToMentalEntity,
  mentalEntitiesMatch,
  MentalEntity,
} from "../traits/memory";

type ChickenData = AnimalData & {
  memory: MentalEntity[];
};

export const pickNearestFoodInMemoryAndKeepItAsTarget =
  (that: Chicken & {}) => (): MentalEntity | undefined => {
    const { target, memory, position } = that.data;

    // Animal already has a target in mind
    if (target) {
      const thinksTargetStillThere = memory.some((memoryItem) =>
        mentalEntitiesMatch(memoryItem, target)
      );

      // stick to the same target
      if (thinksTargetStillThere) {
        return target;
      }

      // can't see target anymore, so forget about it
      that.data.target = undefined;
    }

    // no target, so pick closest seed in memory
    // TO DO - way to look up Class by Entity name
    const nearestFood = memory
      .filter((memoryItem) =>
        memoryItem.entityType.toLowerCase().includes("seed")
      )
      .sort(
        (a, b) =>
          getDistance(a.data.position, position) -
          getDistance(b.data.position, position)
      )[0];

    // if there is food, set it as target
    if (nearestFood) {
      that.report(
        `${that.description} remembers a ${
          nearestFood.entityType
        } at ${describePosition(nearestFood.data.position)} which is ${getDistance(nearestFood.data.position, that.data.position)} away.`
      );

      that.data.target = nearestFood;
      return target;
    }

    // found no target
    return undefined;
  };

export class Chicken extends Animal {
  data: ChickenData;
  ENTITY_TYPE_ID = "Chicken";
  corpseEnergy = 50;
  foodTypes = [Seed];
  observationRange = 4;

  searchForFood = searchInOneRandomDirection(this);
  chooseFoodTarget = pickNearestFoodInMemoryAndKeepItAsTarget(this);

  constructor(data: ChickenData, id?: string) {
    super(data, id);
    this.data = data;
  }

  updateMemory(thingsICanSee: Entity[]) {
    const memoryCopy = [...this.data.memory].filter(
      (memory) => !this.canSeePosition(memory.data.position)
      // remove things in memory that are in observation range
    );
    memoryCopy.push(...thingsICanSee.map(entityToMentalEntity));
    this.data.memory.splice(0, this.data.memory.length, ...memoryCopy);
  }

  act() {
    const diedOfStarvation = this.starve();
    if (diedOfStarvation) {
      return;
    }

    const thingsICanSee = this.observe();
    this.updateMemory(thingsICanSee);

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
