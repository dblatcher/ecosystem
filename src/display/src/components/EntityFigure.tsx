import { h, Fragment } from "preact";
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

      {entity instanceof Plant && <PlantDetails plant={entity} />}
      {entity instanceof Animal && <AnimalDetails animal={entity} />}
    </figure>
  );
};

export default EntityFigure;
