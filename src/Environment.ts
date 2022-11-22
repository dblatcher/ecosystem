import { Space } from "./baseTypes";
import { Entity } from "./Entity";
import { Eventlogger } from "./EventLogger";

export type EnvironmentData = {
  space: Space;
  time: number;
};

export class Environment {
  data: EnvironmentData;
  entities: Entity[];
  private eventLogger: Eventlogger;

  constructor(data: EnvironmentData, entities: Entity[] = []) {
    this.data = data;
    this.entities = [];
    this.eventLogger = new Eventlogger();
    entities.forEach((entity) => entity.join(this));
  }

  public log(info: string) {
    this.eventLogger.report(info);
  }

  tick() {
    this.data.time++;
    this.log(`TIME: ${this.data.time}`);

    const entitiesThatExistedAtStartOfTick = [...this.entities];

    entitiesThatExistedAtStartOfTick.forEach((entity) => {
      if (entity.environment === this) {
        entity.act();
      }
    });
  }
}
