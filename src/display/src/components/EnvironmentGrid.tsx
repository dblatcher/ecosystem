import { h } from "preact";
import { Environment } from "../../../Environment";
import Entity from "./EntityFigure";

interface Props {
  environment: Environment;
}

const EnvironmentGrid = ({ environment }: Props) => {
  const { width, height } = environment.data.space;
  const { entities } = environment;

  return (
    <figure
      style={{
        display: "block",
        position: "relative",
        border: "5px outset gray",
        width: `${2 * width}rem`,
        height: `${2 * height}rem`,
      }}
    >
      {entities.map((entity, index) => (
        <Entity key={index} entity={entity} />
      ))}
    </figure>
  );
};

export default EnvironmentGrid;
