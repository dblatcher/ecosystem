import { h, Component, Fragment } from "preact";
import { Environment } from "../../../Environment";
import EnvironmentGrid from "./EnvironmentGrid";
import { makeEnvironment } from "../../../testEcosystem";

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};
type State = {
  log: string[];
};

export default class GridContainer extends Component<Props, State> {
  environment?: Environment;

  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      log: [],
    };
    this.tickEnviroment = this.tickEnviroment.bind(this);
  }

  tickEnviroment() {
    if (!this.environment) {
      return;
    }
    const newLogs = this.environment.tick();
    this.setState(() => ({
      log: [...newLogs],
    }));
    this.forceUpdate();
  }

  render() {
    const { log } = this.state;
    return (
      <div style={{ display: "flex" }}>
        {!!this.environment && (
          <section>
            <p>
              squares ={" "}
              {this.environment.data.space.height *
                this.environment.data.space.width}
            </p>
            <EnvironmentGrid environment={this.environment} />
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
