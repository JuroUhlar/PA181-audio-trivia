import React from 'react';

import './App.css';
import Speak from './components/Speak';

interface AppState {
  text: string
}

export class App extends React.Component<any, AppState> {

  constructor(props: any) {
    super(props);
    this.input = React.createRef();
    this.state = {
      text: 'Say something'
    }
  }

  input: React.RefObject<HTMLInputElement>;

  componentDidMount() {
    this.input.current!.focus();
  }


  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    let input = this.input.current!;
    let val = input.value;
    this.setState(() => ({
      text: val
    }))
    input.value = '';
    event.preventDefault();
  }

  render() {
    return (
      <div className="App">
        <h1>Audio trivia </h1>

        <form onSubmit={this.handleSubmit}>
          <label>
            Say something: <br/>
            <input type="text" ref={this.input} id='textInput'/>
          </label>
          <input type="submit" value="Submit" />
        </form>

        <Speak text={this.state.text} />
      </div>
    );
  }
}

export default App;