import { Animal } from "../abstract-entities/Animal";
import { getRandomDirection, describeDirection } from "../positions";

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
