class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "0",
      formula: ""
    };
    this.handleClick = this.handleClick.bind(this);
    this.setNewState = this.setNewState.bind(this);
  }

  handleClick(arg) {
    const input = this.state.input;
    const formula = this.state.formula;
    // 'CE' input
    if (arg === "CE") {
      this.setNewState("0", "");
      return;
    }
    // ' . 0-9' input
    let regex = new RegExp(/[.0-9]/);
    if (regex.test(arg)) {
      if (input == "0") {
        this.setNewState(arg, arg);
        return;
      }
      if (arg === "." && input.includes(arg)) return;
      this.setNewState(input + arg, formula + arg);
    }
    // '=' input
    if (arg === "=") {
      if (formula.includes("=")) return;
      if (formula !== "") {
        const output = eval(formula);
        this.setNewState(output, formula + arg + output);
      }
    }
    // '/*-+' input
    regex = new RegExp(/[*/+-]$/);
    if (regex.test(arg)) {
      if (formula === "") {
        if (arg === "-") this.setNewState(arg, arg);
        if (arg === "/" || arg === "*") return;
      }
      if (formula.includes("=")) {
        this.setNewState(arg, input + arg);
        return;
      }
      if (!regex.test(formula)) {
        this.setNewState(arg, formula + arg);
      } else {
        if (arg === "-") {
          if (formula.slice(-1) === "-") return;
          if (regex.test(formula.slice(-2).charAt(0))) {
            this.setNewState(arg, formula.slice(0, -2) + arg);
            return;
          }
          this.setNewState(arg, formula + arg);
        } else {
          if (regex.test(formula.slice(-2).charAt(0))) {
            this.setNewState(arg, formula.slice(0, -2) + arg);
          } else {
            this.setNewState(arg, formula.slice(0, -1) + arg);
          }
        }
      }
    }
  }

  setNewState(input, formula) {
    this.setState({
      input,
      formula
    });
  }

  render() {
    return (
      <div id="calculator">
        <Formula formula={this.state.formula} />
        <Display display={this.state.input} />
        <Buttons function={this.handleClick} />
      </div>
    );
  }
}

const Buttons = (props) => {
  const buttonArr = [["one", "1"], ["two", "2"], ["three", "3"], ["four", "4"], ["five", "5"], ["six", "6"], ["seven", "7"], ["eight", "8"], ["nine", "9"], ["zero", "0"], ["add", "+"], ["equals", "="], ["subtract", "-"], ["multiply", "*"], ["divide", "/"], ["decimal", "."], ["clear", "CE"]];
 
  const buttonPad = buttonArr.map((el, i, arr) => {
    return (
      <Button
        id={arr[i][0]}
        class={"button"}
        label={arr[i][1]}
        function={() => props.function(arr[i][1])}
      />
    );
  });
  
  return (
    <div id="buttons">{buttonPad}</div>
  );
};

const Button = (props) => {
  return (
    <div id={props.id} className={props.class} onClick={props.function}>
      {props.label}
    </div>
  );
};

const Display = (props) => {
  return <div id="display">{props.display}</div>;
};

const Formula = (props) => {
  return <div id="formula">{props.formula}</div>;
};

ReactDOM.render(<App />, document.getElementById("root"));
