import React from 'react';

import './App.css';
import Speak from './components/Speak';

export class App extends React.Component {

  constructor(props:any) {
    super(props);
    this.input = React.createRef();
  }

  handleSubmit = (event:any) => {
    alert('A name was submitted: ' + this.input.current.value);
    event.preventDefault();
  }

  input:any;

  render() {

    return (
      <div className="App">
          <h1>Audio trivia </h1>
  
          <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input type="text" ref={this.input} />
          </label>
          <input type="submit" value="Submit" />
        </form>
  
          <Speak text="Hello world" />
      </div>
    );
  }
}

export default App;
