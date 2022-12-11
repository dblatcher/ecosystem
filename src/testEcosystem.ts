// import { Animal } from "./abstract-entities/Animal";
import { Bug } from "./entity-types/Bug";
import { Chicken } from "./entity-types/Chicken";
import { RyeGrass, RyeSeed } from "./entity-types/RyeGrass";
import { Environment } from "./Environment";
import { SilentEventLogger } from "./EventLogger";

export const makeEnvironment = (): Environment => {
  return new Environment(
    {
      space: { width: 12, height: 20 },
      time: 0,
    },
    [
      new Chicken(
        { fat: 20, energy: 20, position: { x: 7, y: 6 }, memory: [] },
        "sally"
      ),
      new Chicken(
        { fat: 30, energy: 5, position: { x: 2, y: 6 }, memory: [] },
        "bob"
      ),
      RyeGrass.makeLooseSeed({ energy: 20 }, { x: 2, y: 5 }),
      RyeGrass.makeLooseSeed({ energy: 20 }, { x: 2, y: 4 }),
      RyeGrass.makeLooseSeed({ energy: 20 }, { x: 2, y: 3 }),
      RyeGrass.makeLooseSeed({ energy: 20 }, { x: 2, y: 2 }),

      RyeGrass.makeLooseSeed({ energy: 20 }, { x: 9, y: 6 }),
      RyeGrass.makeLooseSeed({ energy: 20 }, { x: 3, y: 6 }),
      RyeGrass.makeLooseSeed({ energy: 20 }, { x: 7, y: 12 }),

      new RyeGrass({
        energy: 10,
        position: { x: 10, y: 12 },
        leaves: [{ energy: 5, surface: 10 }],
        seeds: [{ energy: 20 }],
        stalkHeight: 8,
      }),
    ],
    {
      logger: new SilentEventLogger(),
    }
  );
};
