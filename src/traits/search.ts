import { Animal } from "../abstract-entities/Animal";
import { AnimalWithMemory } from "../abstract-entities/AnimalWithMemory";
import { Entity } from "../Entity";
import { entityTypeIsOfClass } from "../entity-lookup";
import {
  getRandomDirection,
  describeDirection,
  describePosition,
  getDistance,
} from "../positions";
import { mentalEntitiesMatch, MentalEntity } from "./memory";

export const sayHello = (that: Animal) => () => {
  console.log(
    `Hello, I am a ${that.ENTITY_TYPE_ID}. I eat ${that.foodTypes[0].name}.`
  );
};

export const searchInOneRandomDirection = (that: Animal) => () => {
  if (!that.data.direction) {
    that.data.direction = getRandomDirection();
    that.report(
      `${that.description} is heading ${describeDirection(that.data.direction)}`
    );
  }
  that.moveBy(that.data.direction || { x: 0, y: 0 });
  that.report(
    `${that.description} kept going ${describeDirection(that.data.direction)}`
  );
};

export const pickNearestFoodInSightAndKeepItAsTarget =
  (that: Animal) =>
  (thingsICanSee: Entity[]): MentalEntity | undefined => {
    const { foodTarget } = that.data;

    // Animal already has a target in mind
    if (foodTarget) {
      const canStillSeeTarget = !!that.findExistingTargetFrom(thingsICanSee);

      // stick to the same target
      if (canStillSeeTarget) {
        return foodTarget;
      }

      // can't see target anymore, so forget about it
      that.data.foodTarget = undefined;
    }

    // no target, so look for food
    const nearestFood = that.findNearestOfClass(thingsICanSee, that.foodTypes);
    // if there is food, set it as target
    if (nearestFood) {
      return that.setTarget(nearestFood);
    }

    // found no target
    return undefined;
  };

export const pickNearestFoodInMemoryAndKeepItAsTarget =
  (that: AnimalWithMemory & {}) => (): MentalEntity | undefined => {
    const { foodTarget, memory, position } = that.data;

    // Animal already has a target in mind
    if (foodTarget) {
      const thinksTargetStillThere = memory.some((memoryItem) =>
        mentalEntitiesMatch(memoryItem, foodTarget)
      );

      // stick to the same target
      if (thinksTargetStillThere) {
        return foodTarget;
      }

      that.report(
        `${that.description} was looking for a ${
          foodTarget.entityType
        } at ${describePosition(foodTarget.data.position)}, but it is gone.`
      );
      that.data.foodTarget = undefined;
    }

    // no target, so pick closest seed in memory
    // TO DO - way to look up Class by Entity name

    const nearestFood = memory
      .filter((memoryItem) =>
        entityTypeIsOfClass(memoryItem.entityType, that.foodTypes)
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
        } at ${describePosition(
          nearestFood.data.position
        )} which is ${getDistance(
          nearestFood.data.position,
          that.data.position
        )} away.`
      );

      that.data.foodTarget = nearestFood;
      return foodTarget;
    }

    // found no target
    return undefined;
  };
