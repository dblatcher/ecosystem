import { h, Fragment } from "preact";
import { Plant } from "../../../abstract-entities/Plant";

export const PlantDetails = (props: { plant: Plant }) => {
  const { energy } = props.plant.data;
  const { totalLeafSurface } = props.plant;
  return (
    <>
      <span
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          transform: "translate(0, 100%)",
        }}
      >
        E={energy}
      </span>
      <span
        style={{
          fontSize: "1em",
          position: "absolute",
          top: 0,
          left: 0,
          transform: "translate(0, -100%)",
        }}
      >
        L={totalLeafSurface}
      </span>
    </>
  );
};
