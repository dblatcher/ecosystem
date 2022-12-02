import {
  describePosition,
  displace,
  getRandomDirection,
  Position,
} from "../positions";
import { Plant, PlantData } from "./Plant";
import type { Seed } from "./Plant";

export interface RyeGrassData extends PlantData {}

export class RyeGrass extends Plant {
  ENTITY_TYPE_ID = "RyeGrass";
  data: RyeGrassData;

  static GERMINATION_TIME = 12;
  minHeightForLeaves = 4;
  maxLeafSize = 5;
  maxLeaves = 4;
  newLeafCost = 5;
  stalkGrowCost = 2;

  minHeightForSeeds = 8;
  newSeedCost = 10;
  maxSeeds = 8;
  ripeSeedEnergy = 20;

  constructor(data: RyeGrassData, id?: string) {
    super(data, id);
    this.data = data;
  }

  static makeLooseSeed(seed: Seed, position: Position): RyeGrass {
    return new RyeGrass({
      position,
      leaves: [],
      seeds: [],
      energy: seed.energy,
      stalkHeight: 0,
      timeToGerminate: RyeGrass.GERMINATION_TIME,
    });
  }

  act(): void {
    if (this.hasGerminated) {
      this.photosynthesise();
      this.feedSeeds();
      this.grow();

      const wind = this.environment?.getWindAt(this.data.position);
      if (wind && wind?.speed > 2) {
        this.releaseSeeds();
      }
    } else {
      this.germinate();
    }
  }

  grow(): void {
    const { energy, stalkHeight, leaves, seeds } = this.data;
    const shouldGrowLeaves =
      leaves.length > 0 &&
      stalkHeight >= this.minHeightForLeaves &&
      leaves.some((leaf) => leaf.surface < this.maxLeafSize);

    const shouldBudNewLeaf =
      leaves.length < this.maxLeaves &&
      (energy > 10 || leaves.length === 0) &&
      stalkHeight >= this.minHeightForLeaves &&
      leaves.every((leaf) => leaf.surface >= this.maxLeafSize);

    const shouldGrowStalk =
      stalkHeight < this.minHeightForLeaves ||
      (stalkHeight < this.minHeightForSeeds && energy > 10);

    const shouldAddSeed =
      stalkHeight >= this.minHeightForSeeds &&
      seeds.length < this.maxSeeds &&
      energy > 10;

    if (shouldGrowStalk) {
      this.growStalk();
    } else if (shouldBudNewLeaf) {
      this.budNewLeaf();
    } else if (shouldGrowLeaves) {
      this.growLeaves();
    } else if (shouldAddSeed) {
      this.addSeed();
    }
  }

  budNewLeaf() {
    if (this.data.energy < this.newLeafCost) {
      this.report(`${this.description} lacks the energy for a new leaf`);
      return;
    }
    this.data.energy -= this.newLeafCost;
    this.data.leaves.push({ energy: 1, surface: 0 });
    this.report(`${this.description} budded a new leaf.`);
  }

  addSeed() {
    if (this.data.energy < this.newSeedCost) {
      this.report(`${this.description} lacks the energy for a new seed`);
      return;
    }
    this.data.energy -= this.newSeedCost;
    this.data.seeds.push({ energy: 1 });
    this.report(`${this.description} added a new seed.`);
  }

  feedSeeds() {
    const { seeds } = this.data;
    const growCost = 1;
    let energySpent = 0;

    seeds.forEach((seed) => {
      if (seed.energy < this.ripeSeedEnergy && this.data.energy >= growCost) {
        this.data.energy -= growCost;
        seed.energy += growCost;
        energySpent += growCost;
      }
    });
    if (energySpent > 0) {
      this.report(`${this.description} invested ${energySpent} in its seeds.`);
    }
  }

  growStalk() {
    if (this.data.energy < this.stalkGrowCost) {
      this.report(`${this.description} lacks the energy to grow stalk`);
      return;
    }
    this.data.energy -= this.stalkGrowCost;
    this.data.stalkHeight++;
    this.report(`${this.description} grew to ${this.data.stalkHeight}.`);
  }

  growLeaves() {
    const [smallestLeaf] = this.data.leaves.sort(
      (a, b) => a.surface - b.surface
    );
    const costToGrow = smallestLeaf.surface * 2;
    if (this.data.energy < costToGrow) {
      this.report(
        `${this.description} lacks the energy to grow its smallest leaf`
      );
      return;
    }
    this.data.energy -= costToGrow;
    smallestLeaf.energy++;
    smallestLeaf.surface++;
    this.report(
      `${this.description} grew a leaf to ${smallestLeaf.surface} for ${costToGrow}. It now has ${this.totalLeafSurface} coverage`
    );
  }

  releaseSeeds() {
    const { environment } = this;
    const { seeds, position } = this.data;
    if (!environment) {
      return;
    }
    const wind = environment.getWindAt(position);
    const ripeSeeds = seeds.filter(
      (seed) => seed.energy >= this.ripeSeedEnergy
    );
    const remainingSeeds = seeds.filter(
      (seed) => seed.energy < this.ripeSeedEnergy
    );

    seeds.splice(0, seeds.length, ...remainingSeeds);
    ripeSeeds.forEach((seed) => {
      const landingPosition = displace(
        displace(position, wind?.direction, wind?.speed * 2),
        getRandomDirection(),
        Math.ceil(wind.speed / 2)
      );

      const looseSeed = RyeGrass.makeLooseSeed(seed, landingPosition);

      this.report(
        `${this.description} released a seed to ${describePosition(
          looseSeed.data.position
        )}.`
      );
      looseSeed.join(environment);
    });
  }
}
