import { describePosition, displace, getRandomDirection } from "../positions";
import { Organic, OrganicData } from "./Organic";

type Leaf = {
  surface: number;
  energy: number;
};

type Seed = {
  energy: number;
};

export interface RyeGrassData extends OrganicData {
  leaves: Leaf[];
  seeds: Seed[];
  stalkHeight: number;
}

export class RyeGrass extends Organic {
  ENTITY_TYPE_ID = "RyeGrass";
  data: RyeGrassData;

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

  private get totalLeafSurface(): number {
    return this.data.leaves
      .map((leaf) => leaf.surface)
      .reduce((p, c) => p + c, 0);
  }

  act(): void {
    this.photosynthesise();
    this.feedSeeds();
    this.grow();

    const wind = this.environment?.getWindAt(this.data.position);
    if (wind && wind?.speed > 2) {
      this.releaseSeeds();
    }
  }

  grow() {
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

  photosynthesise() {
    const { leaves, position } = this.data;
    if (this.environment?.isSunlightAt(position)) {
      const glucose = this.totalLeafSurface * 0.25;

      this.data.energy += glucose;
      this.report(
        `${this.description} got ${glucose.toFixed(4)} energy from its ${
          leaves.length
        } leaves, now has ${this.data.energy}.`
      );
    }
  }

  releaseSeeds() {
    const { environment } = this;
    const { seeds } = this.data;
    if (!environment) {
      return;
    }
    const wind = environment.getWindAt(this.data.position);
    const ripeSeeds = seeds.filter(
      (seed) => seed.energy >= this.ripeSeedEnergy
    );
    const remainingSeeds = seeds.filter(
      (seed) => seed.energy < this.ripeSeedEnergy
    );

    seeds.splice(0, seeds.length, ...remainingSeeds);
    ripeSeeds.forEach((seed) => {

      const newPlant = new RyeGrass({
        position: displace(displace(this.data.position, wind?.direction, wind?.speed*2), getRandomDirection(), Math.ceil(wind.speed/2)),
        leaves: [],
        seeds: [],
        energy: seed.energy,
        stalkHeight: 0,
      });

      this.report(`${this.description} released a seed to ${describePosition(newPlant.data.position)}.`)
      newPlant.join(environment);
    });
  }

  get description(): string {
    const { ENTITY_TYPE_ID, id } = this;
    const name = id ? `${id} the ` : "";
    const height = `${this.data.stalkHeight} inch `;
    const leafCount = `(${this.data.leaves.length} leaves)`;
    const seedCount = `(${this.data.seeds.length} seeds)`;
    const place = describePosition(this.data.position);

    return `${name}${height}${ENTITY_TYPE_ID} ${leafCount}${seedCount}${place}`;
  }
}
