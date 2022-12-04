import { Bug } from "./entity-types/Bug";
import { RyeGrass } from "./entity-types/RyeGrass";
import { Environment } from "./Environment";
import { SilentEventLogger } from "./EventLogger";

export const makeEnvironment = (): Environment => {
  return new Environment(
    {
      space: { width: 10, height: 20 },
      time: 0,
    },
    [
      // new Mould({ energy: 4, position: { x: 5, y: 5 } }),
      new Bug({ energy: 15, position: { x: 0, y: 2 } }),

      // new RyeGrass({
      //   energy: 15,
      //   stalkHeight: 0,
      //   position: { x: 8, y: 1 },
      //   leaves: [],
      //   seeds: [],
      //   timeToGerminate: 0,
      // }),

      RyeGrass.makeLooseSeed({ energy: 20 }, { x: 2, y: 2 }),
      new RyeGrass({
        energy: 30,
        stalkHeight: 6,
        position: { x: 5, y: 1 },
        leaves: [
          { energy: 5, surface: 10 },
          { energy: 5, surface: 10 },
          { energy: 5, surface: 10 },
        ],
        seeds: [{ energy: 15 }],
        timeToGerminate: 0,
      }),
    ],
    {
      logger: new SilentEventLogger(),
    }
  );
};
