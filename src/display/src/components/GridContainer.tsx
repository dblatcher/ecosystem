import { h, Component } from "preact";
import { Environment } from "../../../Environment";
import EnvironmentGrid from "./EnvironmentGrid";
import { makeEnvironment } from "../../../testEcosystem";
import { Clock } from "./Clock";

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};
type State = {
  log: string[];
  gridScalePercent: number;
  tickRate: number;
};

export default class GridContainer extends Component<Props, State> {
  environment?: Environment;
  timer?: number;

  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      log: [],
      gridScalePercent: 100,
      tickRate: 0,
    };
    this.tickEnviroment = this.tickEnviroment.bind(this);
    this.scaleDown = this.scaleDown.bind(this);
    this.scaleUp = this.scaleUp.bind(this);
    this.setTickRate = this.setTickRate.bind(this);
  }


  componentWillUnmount(): void {
    window.clearInterval(this.timer)
  }

  tickEnviroment() {
    if (!this.environment) {
      return;
    }
    this.environment.tick();
    const newLogs = this.environment.eventLogger.eventsLastTick.map(
      (report) => report.message
    );
    this.setState({ log: newLogs });
  }

  scaleDown() {
    this.setState({
      gridScalePercent: Math.max(20, this.state.gridScalePercent - 10),
    });
  }
  scaleUp() {
    this.setState({
      gridScalePercent: Math.min(200, this.state.gridScalePercent + 10),
    });
  }

  setTickRate(value: number) {
    const adjustedValue = Math.min(Math.max(0, value), 10)
    this.setState({ tickRate: adjustedValue })
    window.clearInterval(this.timer)
    if (adjustedValue > 0) {
      this.timer = window.setInterval(this.tickEnviroment, 10 * (11 - adjustedValue))
    }
  }

  render() {
    const { log, gridScalePercent, tickRate } = this.state;
    return (
      <div style={{ display: "flex" }}>
        {!!this.environment && (
          <section>
            <div>
              <button onClick={this.scaleDown}>-</button>
              <button onClick={this.scaleUp}>+</button>
            </div>
            <Clock environment={this.environment} />
            <EnvironmentGrid
              environment={this.environment}
              scalePercent={gridScalePercent}
            />
          </section>
        )}

        <section>
          <button disabled={tickRate > 0} onClick={this.tickEnviroment}>tick</button>
          <div>
            <span>{tickRate}</span>
            <button onClick={() => { this.setTickRate(tickRate + 1) }}>+</button>
            <button onClick={() => { this.setTickRate(tickRate - 1) }}>-</button>
          </div>
          <hr />
          <ul>
            {log.map((entry, index) => (
              <li key={index}>{entry}</li>
            ))}
          </ul>
        </section>
      </div>
    );
  }

  componentWillMount(): void {
    this.environment = makeEnvironment();
  }
}
