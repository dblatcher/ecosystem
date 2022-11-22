import { Bug } from "./entity-types/Bug";
import { Mould } from "./entity-types/Mould";
import { Stone } from "./entity-types/Stone";
import { Environment } from "./Environment";


const barryTheMould = new Mould(
  { position: { x: 12, y: 13 }, energy: 5 },
  "Barry"
);
const katyTheBug = new Bug({ position: { x: 9, y: 13 }, energy: 10 }, "Katy");
const unnamedBug = new Bug({ position: { x: 9, y: 14 }, energy: 3 });

const environment = new Environment(
  { space: { width: 100, height: 100 }, time: 0 },
  [
    katyTheBug,
    unnamedBug,
    new Stone({ position: { x: 15, y: 10 } }),
    barryTheMould,
  ]
);

console.clear()
console.log("\n*\n**\n***")
while (environment.data.time < 20) {
  environment.tick();
}
console.log("\n*\n**\n***")
