// import { Animal } from "./abstract-entities/Animal";
import { Animal } from "./abstract-entities/Animal";
import { Clock } from "./Clock";
import { Bug } from "./entity-types/Bug";
import { Chicken, EggOfChicken } from "./entity-types/Chicken";
import { RyeGrass, RyeSeed } from "./entity-types/RyeGrass";
import { Environment } from "./Environment";
import { EventLogger, SilentEventLogger } from "./EventLogger";
import { pos } from "./positions";

const clock = new Clock(20)

export const makeEnvironment = (
  logger: EventLogger = new SilentEventLogger((r) => r.from instanceof Animal)
): Environment => {
  return new Environment(
    {
      space: { width: 25, height: 25 },
      time: clock.giveTickCount({ days: 0, hours: 8, minutes: 55, seconds: 0 })
    },
    [
      // new Chicken(
      //   { fat: 20, energy: 20, position: { x: 7, y: 6 }, memory: [] },
      //   "sally"
      // ),
      new Chicken({ fat: 30, energy: 200, isAsleep: true, sleepDebt: 1, ...pos(2, 9), memory: [] }, "bob"),
      // new EggOfChicken(
      //   { energy: 20, position: { x: 2, y: 6 }, timeToHatch: 5 },
      //   "bob jr"
      // ),
      RyeGrass.makeLooseSeed({ energy: 20 }, { x: 2, y: 5 }),
      RyeGrass.makeLooseSeed({ energy: 20 }, { x: 2, y: 4 }),
      RyeGrass.makeLooseSeed({ energy: 20 }, { x: 2, y: 3 }),
      RyeGrass.makeLooseSeed({ energy: 20 }, { x: 2, y: 2 }),

      RyeGrass.makeLooseSeed({ energy: 20 }, { x: 9, y: 6 }),
      RyeGrass.makeLooseSeed({ energy: 20 }, { x: 3, y: 6 }),
      RyeGrass.makeLooseSeed({ energy: 20 }, { x: 7, y: 12 }),

      // new Bug({ energy: 10, ...pos(5, 10) }),

      // new RyeGrass({
      //   energy: 10,
      //   ...pos(10, 12),
      //   leaves: [{ energy: 5, surface: 10 }],
      //   seeds: [{ energy: 20 }],
      //   stalkHeight: 8,
      // }),
    ],
    {
      logger, clock
    }
  );
};
