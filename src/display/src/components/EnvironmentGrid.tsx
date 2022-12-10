import { h } from "preact";
import { Environment } from "../../../Environment";
import Entity from "./EntityFigure";

interface Props {
  environment: Environment;
  scalePercent?: number;
}

const EnvironmentGrid = ({ environment, scalePercent = 100 }: Props) => {
  const { width, height } = environment.data.space;
  const { entities } = environment;

  return (
    <figure
      style={{
        fontSize: `${scalePercent}%`,
        display: "block",
        position: "relative",
        border: "5px outset gray",
        width: `${2 * width}em`,
        height: `${2 * height}em`,
      }}
    >
      {entities.map((entity, index) => (
        <Entity key={index} entity={entity} />
      ))}
    </figure>
  );
};

export default EnvironmentGrid;
