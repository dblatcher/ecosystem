import { Space } from "./positions";
import { Entity } from "./Entity";
import { EventConsoleLogger } from "./EventLogger";

export type EnvironmentData = {
  space: Space;
  time: number;
};

export class Environment {
  data: EnvironmentData;
  entities: Entity[];
  private eventLogger: EventConsoleLogger;
  private eventsLastTick: string[];

  constructor(data: EnvironmentData, entities: Entity[] = []) {
    this.data = data;
    this.entities = [];
    this.eventLogger = new EventConsoleLogger();
    this.eventsLastTick = [];
    entities.forEach((entity) => entity.join(this));
  }

  public log(info: string) {
    this.eventLogger.report(info);
    this.eventsLastTick.push(info);
  }

  tick(): string[] {
    this.eventsLastTick.splice(0, this.eventsLastTick.length);
    this.data.time++;
    this.log(`\nTIME: ${this.data.time}`);

    const entitiesThatExistedAtStartOfTick = [...this.entities];

    entitiesThatExistedAtStartOfTick.forEach((entity) => {
      if (entity.environment === this) {
        entity.act();
      }
    });

    return this.eventsLastTick;
  }
}
