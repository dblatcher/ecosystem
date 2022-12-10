import { Animal } from "../abstract-entities/Animal";
import { Entity } from "../Entity";
import { getRandomDirection, describeDirection } from "../positions";
import { MentalEntity } from "./memory";

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
    const { target } = that.data;

    // Animal already has a target in mind
    if (target) {
      const canStillSeeTarget = !!that.findExistingTargetFrom(thingsICanSee);

      // stick to the same target
      if (canStillSeeTarget) {
        return target;
      }

      // can't see target anymore, so forget about it
      that.data.target = undefined;
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
