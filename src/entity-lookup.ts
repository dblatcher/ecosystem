import { Animal } from "./abstract-entities/Animal";
import { AnimalWithMemory } from "./abstract-entities/AnimalWithMemory";
import { Egg } from "./abstract-entities/Egg";
import { Organic } from "./abstract-entities/Organic";
import { Plant } from "./abstract-entities/Plant";
import { Seed } from "./abstract-entities/Seed";
import { Entity } from "./abstract-entities/Entity";
import { Berry } from "./entity-types/Berry";
import { Bug } from "./entity-types/Bug";
import { Chicken, EggOfChicken } from "./entity-types/Chicken";
import { Corpse } from "./entity-types/Corpse";
import { Mould } from "./entity-types/Mould";
import { RyeGrass, RyeSeed } from "./entity-types/RyeGrass";
import { Stone } from "./entity-types/Stone";


export const entityMap: Readonly<Record<string, typeof Entity | undefined>> = {
  Entity,
  Animal,
  AnimalWithMemory,
  Organic,
  Plant,
  Seed,
  Berry,
  Bug,
  Chicken,
  Corpse,
  Mould,
  RyeGrass,
  RyeSeed,
  Stone,
  Egg,
  EggOfChicken,
};

export const entityTypeIsOfClass = (
  entityType: string,
  classes: typeof Entity[]
): boolean => {
  const EntityClass = entityMap[entityType];
  if (!EntityClass) {
    return false;
  }
  return classes.some((Class) => EntityClass.prototype instanceof Class);
};
