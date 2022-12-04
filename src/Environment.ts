import { Space, Position } from "./positions";
import { Entity } from "./Entity";
import { EventConsoleLogger, EventLogger, EventReport } from "./EventLogger";
import type { Direction } from "./positions";

export type EnvironmentData = {
  space: Space;
  time: number;
};

type EnvironmentConfig = {
  logger?: EventLogger;
};

export class Environment {
  data: EnvironmentData;
  entities: Entity[];
  private eventLogger: EventConsoleLogger;
  private eventsLastTick: string[];

  constructor(
    data: EnvironmentData,
    entities: Entity[] = [],
    config: EnvironmentConfig = {}
  ) {
    this.data = data;
    this.entities = [];
    this.eventLogger = config.logger || new EventConsoleLogger();
    this.eventsLastTick = [];
    entities.forEach((entity) => entity.join(this));
  }

  public log(report: EventReport) {
    this.eventLogger.report(report);
    this.eventsLastTick.push(report.message);
  }

  isSunlightAt(position: Position): boolean {
    return true;
  }

  getWindAt(position: Position): { direction: Direction; speed: number } {
    return {
      direction: { x: 0, y: 1 },
      speed: 3,
    };
  }

  tick(): string[] {
    this.eventsLastTick.splice(0, this.eventsLastTick.length);
    this.data.time++;
    this.log({ message: `\nTIME: ${this.data.time}` });

    const entitiesThatExistedAtStartOfTick = [...this.entities];

    entitiesThatExistedAtStartOfTick.forEach((entity) => {
      if (entity.environment === this) {
        entity.act();
      }
    });

    return this.eventsLastTick;
  }
}
