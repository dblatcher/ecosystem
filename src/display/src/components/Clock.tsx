import { h } from "preact";
import { Environment } from "../../../Environment";

interface Props {
  environment: Environment;
}

const formatTimePart = (v: number): string =>
  v >= 10 ? v.toString() : `0${v}`;

export const Clock = ({ environment }: Props) => {
  const { days, hours, minutes, seconds } = environment.calendarTime;
  const { timeOfDay } = environment;

  return (
    <span>
      <span>
        day#<b>{days}</b>
      </span>
      <span>
        [{formatTimePart(hours)}:{formatTimePart(minutes)}:
        {formatTimePart(seconds)}]
      </span>
      <span>({timeOfDay})</span>
    </span>
  );
};
