import { h, Component, Fragment } from "preact";
import { Environment } from "../../../Environment";
import { Mould } from "../../../entity-types/Mould";

const makeEnvironment = (): Environment => {
  return new Environment(
    {
      space: { width: 10, height: 10 },
      time: 0,
    },
    [new Mould({ energy: 4, position: { x: 5, y: 5 } })]
  );
};

export default class Grid extends Component {
  environment?: Environment;

  constructor(props: {}) {
    super(props);
    this.tickEnviroment = this.tickEnviroment.bind(this);
  }

  tickEnviroment() {
    console.log(this.environment?.data.time);
    this.environment?.tick();
    this.forceUpdate()
  }

  render() {
    return (
      <div>
        <p>Grid</p>
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
