import { Bug } from "./entity-types/Bug";
import { Mould } from "./entity-types/Mould";
import { Environment } from "./Environment";

export const makeEnvironment = (): Environment => {
  return new Environment(
    {
      space: { width: 10, height: 10 },
      time: 0,
    },
    [
      new Mould({ energy: 4, position: { x: 5, y: 5 } }),
      new Bug({ energy: 15, position: { x: 0, y: 2 } }),
    ]
  );
};
