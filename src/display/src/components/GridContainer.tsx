import { h, Component, Fragment } from "preact";
import { Environment } from "../../../Environment";
import EnvironmentGrid from "./EnvironmentGrid";
import {makeEnvironment} from "../../../testEcosystem";


export default class GridContainer extends Component {
  environment?: Environment;

  constructor(props: Record<string, never>) {
    super(props);
    this.tickEnviroment = this.tickEnviroment.bind(this);
  }

  tickEnviroment() {
    this.environment?.tick();
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        {!!this.environment && (
          <>
            <p>
              squares ={" "}
              {this.environment.data.space.height *
                this.environment.data.space.width}
            </p>
            <p>
              things ={" "}
              {this.environment?.entities
                .map((entity) => entity.description)
                .join()}
            </p>
            <EnvironmentGrid environment={this.environment} />
            <button onClick={this.tickEnviroment}>tick</button>
          </>
        )}
        {!this.environment && <p>non</p>}
      </div>
    );
  }

  componentWillMount(): void {
    this.environment = makeEnvironment();
  }
}
