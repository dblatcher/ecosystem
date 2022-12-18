import { h } from "preact";
import { Entity } from "../../../Entity";
import { Plant } from "../../../abstract-entities/Plant";
import { PlantDetails } from "./PlantDetails";
import { AnimalDetails } from "./AnimalDetails";
import { Animal } from "../../../abstract-entities/Animal";

interface Props {
  entity: Entity;
}

const EntityFigure = ({ entity }: Props) => {
  const { x, y } = entity.data.position;

  return (
    <figure
      style={{
        display: "block",
        position: "absolute",
        border: "1px dotted yellowgreen",
        background: "#8393ef8a",
        left: `${2 * x}em`,
        top: `${2 * y}em`,
        width: `${2}em`,
        height: `${2}em`,
        margin: 0,
      }}
    >
      <span
        style={{
          fontSize: "2em",
        }}
      >
        {entity.ENTITY_TYPE_ID.substring(0, 1)}
      </span>
      <div
        style={{
          fontSize: "1em",
          padding: '0 .2em',
          position: "absolute",
          left: "100%",
          display: "block",
          top: "0",
          backgroundColor: "rgba(0,0,0,0.6)",
          color: "white",
          whiteSpace: "nowrap",
        }}
      >
        {entity.action}
      </div>

      {entity instanceof Plant && <PlantDetails plant={entity} />}
      {entity instanceof Animal && <AnimalDetails animal={entity} />}
    </figure>
  );
};

export default EntityFigure;
