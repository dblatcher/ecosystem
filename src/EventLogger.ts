import type { Entity } from "./Entity";

export type EventReport = { message: string; from?: Entity };

export abstract class EventLogger {
  readonly eventsLastTick: EventReport[];
  constructor() {
    this.eventsLastTick = [];
  }
  abstract handleReport(info: EventReport): void;
  clearEventsLastTick () {
    this.eventsLastTick.splice(0,this.eventsLastTick.length)
  }
}

export class EventConsoleLogger extends EventLogger {
  handleReport(report: EventReport) {
    console.log(report);
    this.eventsLastTick.push(report)
  }
}

export class SilentEventLogger extends EventLogger {
  handleReport(report: EventReport) {
    this.eventsLastTick.push(report)
  }
}
