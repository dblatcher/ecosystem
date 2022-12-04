import type { Entity } from "./Entity";

export type EventReport = { message: string; from?: Entity };

export abstract class EventLogger {
  abstract report(info: EventReport): void;
}

export class EventConsoleLogger implements EventLogger {
  report(report: EventReport) {
    console.log(report);
  }
}

export class SilentEventLogger implements EventLogger {
  report(report: EventReport) {}
}
