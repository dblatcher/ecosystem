import {
  describePosition,
  Position,
} from "../positions";
import { Organic, OrganicData } from "./Organic";

export type Leaf = {
  surface: number;
  energy: number;
};

export type Seed = {
  energy: number;
};

export interface PlantData extends OrganicData {
  leaves: Leaf[];
  seeds: Seed[];
  stalkHeight: number;
  timeToGerminate: number;
}

export abstract class Plant extends Organic {
  ENTITY_TYPE_ID = "Plant";
  data: PlantData;

  static GERMINATION_TIME = 10;

  constructor(data: PlantData, id?: string) {
    super(data, id);
    this.data = data;
  }

  protected get totalLeafSurface(): number {
    return this.data.leaves
      .map((leaf) => leaf.surface)
      .reduce((p, c) => p + c, 0);
  }

  get hasGerminated(): boolean {
    return this.data.timeToGerminate <= 0;
  }

  static makeLooseSeed: { (seed: Seed, position: Position): Plant };

  germinate() {
    if (this.data.timeToGerminate > 0) {
      this.data.timeToGerminate--;
      if (this.data.timeToGerminate <= 0) {
        this.report(
          `${this.ENTITY_TYPE_ID} seed at ${describePosition(
            this.data.position
          )} has germinated.`
        );
      }
    }
  }

  abstract grow():void



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

  get description(): string {
    const { ENTITY_TYPE_ID, id, hasGerminated } = this;
    const name = id ? `${id} the ` : "";
    const height = `${this.data.stalkHeight} inch `;
    const type = hasGerminated
      ? `${height}${ENTITY_TYPE_ID}`
      : `${ENTITY_TYPE_ID} seed.`;
    const leafCount = `(${this.data.leaves.length} leaves)`;
    const seedCount = `(${this.data.seeds.length} seeds)`;
    const place = describePosition(this.data.position);

    return `${name}${type} ${leafCount}${seedCount}${place}`;
  }
}
