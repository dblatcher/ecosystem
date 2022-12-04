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
  eventLogger: EventConsoleLogger;

  constructor(
    data: EnvironmentData,
    entities: Entity[] = [],
    config: EnvironmentConfig = {}
  ) {
    this.data = data;
    this.entities = [];
    this.eventLogger = config.logger || new EventConsoleLogger();
    entities.forEach((entity) => entity.join(this));
  }

  public receiveReport(report: EventReport) {
    this.eventLogger.handleReport(report);
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

  tick():void {
    this.eventLogger.clearEventsLastTick();
    this.data.time++;
    this.receiveReport({ message: `\nTIME: ${this.data.time}` });

    const entitiesThatExistedAtStartOfTick = [...this.entities];

    entitiesThatExistedAtStartOfTick.forEach((entity) => {
      if (entity.environment === this) {
        entity.act();
      }
    });

  }
}
