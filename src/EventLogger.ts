import type { Entity } from "./abstract-entities/Entity";

export type EventReport = { message: string; from?: Entity };

export abstract class EventLogger {
  readonly eventsLastTick: EventReport[];
  constructor() {
    this.eventsLastTick = [];
  }
  abstract handleReport(info: EventReport): void;
  clearEventsLastTick() {
    this.eventsLastTick.splice(0, this.eventsLastTick.length);
  }
}

export class EventConsoleLogger extends EventLogger {
  handleReport(report: EventReport) {
    console.log(report.message);
    this.eventsLastTick.push(report);
  }
}

export class SilentEventLogger extends EventLogger {
  shouldInclude: { (from: EventReport): boolean };

  constructor(filter?: { (report: EventReport): boolean }) {
    super();
    this.shouldInclude =
      filter ||
      function () {
        return true;
      };
  }

  handleReport(report: EventReport) {
    if (this.shouldInclude(report)) {
      this.eventsLastTick.push(report);
    }
  }
}
