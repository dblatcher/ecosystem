import { h } from "preact";
import { Entity } from "../../../Entity";

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
        left: `${2 * x}rem`,
        top: `${2 * y}rem`,
        width: `${2}rem`,
        height: `${2}rem`,
        fontSize: "200%",
        margin: 0,
      }}
    >
      {entity.ENTITY_TYPE_ID.substring(0, 1)}
    </figure>
  );
};

export default EntityFigure;
