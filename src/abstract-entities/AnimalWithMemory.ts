import { Entity } from "../Entity";
import { entityToMentalEntity, MentalEntity } from "../traits/memory";
import { AnimalData, Animal } from "./Animal";

type AnimalWithMemoryData = AnimalData & {
  memory: MentalEntity[];
};

export abstract class AnimalWithMemory extends Animal {
  data: AnimalWithMemoryData;

  updateMemory(thingsICanSee: Entity[]) {
    const memoryCopy = [...this.data.memory].filter(
      (memory) => !this.canSeePosition(memory.data.position)
      // remove things in memory that are in observation range
    );
    memoryCopy.push(...thingsICanSee.map(entityToMentalEntity));
    this.data.memory.splice(0, this.data.memory.length, ...memoryCopy);
  }

  observe(report?: boolean): Entity[] {
      const thingsICanSee = Animal.prototype.observe.apply(this,[report])
      this.updateMemory(thingsICanSee)
      return thingsICanSee
  }

  constructor(data: AnimalWithMemoryData, id?: string) {
    super(data, id);
    this.data = data;
  }
}
