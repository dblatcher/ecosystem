import { h, Fragment } from "preact";
import { Entity } from "../../../Entity";
import { Plant } from "../../../entity-types/Plant";

interface Props {
  entity: Entity;
}

const PlantDetails = (props: { plant: Plant }) => {
  const { energy, leaves } = props.plant.data;
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
          position: "absolute",
          top: 0,
          left: 0,
          transform: "translate(0, -100%)",
        }}
      >
        leaves={leaves.length}
      </span>
  
    </>
  );
};

const EntityFigure = ({ entity }: Props) => {
  const { x, y } = entity.data.position;

  return (
    <figure
      style={{
        display: "block",
        position: "absolute",
        border: "1px dotted yellowgreen",
        background: "#8393ef8a",
        left: `${2 * x}rem`,
        top: `${2 * y}rem`,
        width: `${2}rem`,
        height: `${2}rem`,
        margin: 0,
      }}
    >
      <span
        style={{
          fontSize: "200%",
        }}
      >
        {entity.ENTITY_TYPE_ID.substring(0, 1)}
      </span>

      {entity instanceof Plant && <PlantDetails plant={entity} />}
    </figure>
  );
};

export default EntityFigure;
