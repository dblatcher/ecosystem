import { Space, Position } from "./positions";
import { Entity } from "./abstract-entities/Entity";
import { EventConsoleLogger, EventLogger, EventReport } from "./EventLogger";
import type { Direction } from "./positions";

const SECONDS_PER_TICK = 15;

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

  get calendarTime() {
    const { time } = this.data;
    const totalSeconds = time * SECONDS_PER_TICK;
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const secondsToday = totalSeconds % (24 * 60 * 60);
    const hours = Math.floor(secondsToday / (60 * 60));
    const minutesAndSecondsInSeconds = secondsToday % (60 * 60);
    const minutes = Math.floor(minutesAndSecondsInSeconds / 60);
    const seconds = minutesAndSecondsInSeconds % 60;
    return { days, hours, minutes, seconds };
  }

  get timeOfDay() {
    const { hours } = this.calendarTime;

    if (hours < 4) {
      return "night";
    } else if (hours < 8) {
      return "dawn";
    } else if (hours < 18) {
      return "day";
    } else if (hours < 22) {
      return "dusk";
    }
    return "night";
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
