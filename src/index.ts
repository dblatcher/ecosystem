import { Animal } from "./abstract-entities/Animal";
import { Berry } from "./entity-types/Berry";
import { Bug } from "./entity-types/Bug";
import { Mould } from "./entity-types/Mould";
import { Stone } from "./entity-types/Stone";
import { Environment } from "./Environment";

const barryTheMould = new Mould(
  { position: { x: 14, y: 13 }, energy: 5 },
  "Barry"
);
const katyTheBug = new Bug(
  { position: { x: 25, y: 13 }, direction: { x: -1, y: 0 }, energy: 3 },
  "Katy"
);
// const unnamedBug = new Bug({ position: { x: 9, y: 14 }, direction: undefined, energy: 3 });

const environment = new Environment(
  { space: { width: 100, height: 100 }, time: 0 },
  [
    katyTheBug,
    new Berry({ position: { x: 25, y: 15 }, energy: 5 }),
    new Stone({ position: { x: 25, y: 10 } }),
    barryTheMould,
  ]
);

console.clear();
console.log("\n*\n**\n***");
while (environment.data.time < 5) {
  environment.tick();
}
console.log("\n*\n**\n***");
