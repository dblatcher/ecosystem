import { Space, Position } from "./positions";
import { Entity } from "./abstract-entities/Entity";
import { EventConsoleLogger, EventLogger, EventReport } from "./EventLogger";
import type { Direction } from "./positions";
import { Clock } from "./Clock";

export type EnvironmentData = {
  space: Space;
  time: number;
};

type EnvironmentConfig = {
  logger?: EventLogger;
  clock?: Clock;
};

export class Environment {
  data: EnvironmentData;
  entities: Entity[];
  eventLogger: EventConsoleLogger;
  clock: Clock;

  constructor(
    data: EnvironmentData,
    entities: Entity[] = [],
    config: EnvironmentConfig = {}
  ) {
    this.data = data;
    this.entities = [];
    this.eventLogger = config.logger || new EventConsoleLogger();
    this.clock = config.clock || new Clock(20);
    entities.forEach((entity) => entity.join(this));
  }

  public receiveReport(report: EventReport) {
    this.eventLogger.handleReport(report);
  }

  get calendarTime() {
    return this.clock.giveCalendarTime(this.data.time)
  }

  get timeOfDay() {
    return this.clock.giveTimeOfDay(this.data.time)
  }

  isSunlightAt(position: Position): boolean {
    return this.timeOfDay === "day";
  }

  getWindAt(position: Position): { direction: Direction; speed: number } {
    return {
      direction: { x: 0, y: 1 },
      speed: 3,
    };
  }

  tick(): void {
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
