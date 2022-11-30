export abstract class EventLogger {
  abstract report(info: string):void
}

export class EventConsoleLogger implements EventLogger {
  report(info: string) {
    console.log(info);
  }
}
