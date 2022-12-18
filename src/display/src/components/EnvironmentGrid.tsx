import { h } from "preact";
import { Environment } from "../../../Environment";
import Entity from "./EntityFigure";

interface Props {
  environment: Environment;
  scalePercent?: number;
}

const timeColors = {
  night: "rgba(0,0,0,.5)",
  dawn: "#e110107d",
  day: "#ffffff7e",
  dusk: "#ee48e37d",
};

const backgroundForTime = (environment: Environment): string => {
  return timeColors[environment.timeOfDay]
};

const EnvironmentGrid = ({ environment, scalePercent = 100 }: Props) => {
  const { width, height } = environment.data.space;
  const { entities } = environment;

  const backgroundColor = backgroundForTime(environment);

  return (
    <figure
      style={{
        fontSize: `${scalePercent}%`,
        display: "block",
        position: "relative",
        border: "5px outset gray",
        width: `${2 * width}em`,
        height: `${2 * height}em`,
        backgroundColor,
      }}
    >
      {entities.map((entity, index) => (
        <Entity key={index} entity={entity} />
      ))}
    </figure>
  );
};

export default EnvironmentGrid;
