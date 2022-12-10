import { h, Component } from "preact";
import { Environment } from "../../../Environment";
import EnvironmentGrid from "./EnvironmentGrid";
import { makeEnvironment } from "../../../testEcosystem";

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};
type State = {
  log: string[];
  gridScalePercent: number;
};

export default class GridContainer extends Component<Props, State> {
  environment?: Environment;

  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      log: [],
      gridScalePercent: 100,
    };
    this.tickEnviroment = this.tickEnviroment.bind(this);
    this.scaleDown = this.scaleDown.bind(this);
    this.scaleUp = this.scaleUp.bind(this);
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

  render() {
    const { log, gridScalePercent } = this.state;
    return (
      <div style={{ display: "flex" }}>
        {!!this.environment && (
          <section>
            <div>
              <button onClick={this.scaleDown}>-</button>
              <button onClick={this.scaleUp}>+</button>
            </div>
            <EnvironmentGrid
              environment={this.environment}
              scalePercent={gridScalePercent}
            />
          </section>
        )}

        <section>
          <ul>
            {log.map((entry, index) => (
              <li key={index}>{entry}</li>
            ))}
          </ul>
          <button onClick={this.tickEnviroment}>tick</button>
        </section>
      </div>
    );
  }

  componentWillMount(): void {
    this.environment = makeEnvironment();
  }
}
