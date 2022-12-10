// import { Animal } from "./abstract-entities/Animal";
import { Bug } from "./entity-types/Bug";
import { Chicken } from "./entity-types/Chicken";
import { RyeGrass, RyeSeed } from "./entity-types/RyeGrass";
import { Environment } from "./Environment";
import { SilentEventLogger } from "./EventLogger";

export const makeEnvironment = (): Environment => {
  return new Environment(
    {
      space: { width: 10, height: 20 },
      time: 0,
    },
    [
      new Chicken({ energy: 20, position: { x: 7, y: 6 }, memory: [] },'sally'),
      new Chicken({ energy: 20, position: { x: 2, y: 6 }, memory: [] },'bob'),

      RyeGrass.makeLooseSeed({ energy: 20 }, { x: 9, y: 6 }),
      RyeGrass.makeLooseSeed({ energy: 20 }, { x: 3, y: 6 }),
      RyeGrass.makeLooseSeed({ energy: 20 }, { x: 7, y: 12 }),
    ],
    {
      logger: new SilentEventLogger(),
    }
  );
};
