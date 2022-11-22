import { getDistance } from "../baseTypes";
import { Animal } from "./Animal";
import { Mould } from "./Mould";


export class Bug extends Animal {
    ENTITY_TYPE_ID = "Bug";
    observationRange = 10;
  
    act() {
      this.data.energy--;
  
      if (this.data.energy <= 0) {
        return this.starve();
      } else {
        const inSight = this.observe();
  
        const nearestFood = this.findNearestMatch(
          (entity) => entity instanceof Mould,
          inSight
        ) as Mould | undefined;
  
        if (nearestFood) {
          const distance = getDistance(
            nearestFood.data.position,
            this.data.position
          );
  
          if (distance > 1) {
            this.environment?.log(
              `${this.description} moving towards ${nearestFood.description}`
            );
            return this.moveTowards(nearestFood);
          }
  
          return this.eatWhole(nearestFood);
        }
  
        this.environment?.log(
          `${this.description} saw no food and waited. E:${this.data.energy}`
        );
      }
    }
  }
  