import { EventConsoleLogger } from "./EventLogger";
import { makeEnvironment } from "./testEcosystem";


const environment = makeEnvironment( new EventConsoleLogger())

console.clear();
console.log("\n*\n**\n***");
while (environment.data.time < 100) {
  environment.tick();
}
console.log("\n*\n**\n***");
