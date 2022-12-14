import { h, Fragment } from "preact";
import { Animal } from "../../../abstract-entities/Animal";

export const AnimalDetails = (props: { animal: Animal }) => {
  const { energy, fat = 0 } = props.animal.data;

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
        E={energy}, F={fat}
      </span>
    </>
  );
};
