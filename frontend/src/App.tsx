import React from 'react';

import './App.css';
import Speak from './components/Speak';
import AudioRecorder from 'react-audio-recorder';

interface AppState {
  text: string
  list: any
}

export class App extends React.Component<any, AppState> {

  constructor(props: any) {
    super(props);
    this.input = React.createRef();
    this.state = {
      text: 'Say something',
      list: []
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

  handleRecording = (event: any) => {
    console.log('Clicks happened');
    console.log(event);
    if (event.audioData != null) {
      const url = window.URL.createObjectURL(event.audioData);
      console.log(url);

      var fd = new FormData().append('audio', event.audioData);

      fetch('http://localhost:5000/api/v1/recognize', {
        headers: {'Accept': 'application/json',
          'Content-Type': 'application/json' },
        method: "POST", body: JSON.stringify({a: 1, b: 'Textual content'})
      });
    }

    // fetch('http://localhost:5000/api/v1/recognize')
    //     .then(res => res.json())

    // fetch('http://localhost:5000/api/v1/recognize')
    //       .then(res => res.json())
    //       .then(list => this.setState({ list }))

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

        <div id='voiceRecord'>
          <label>
            Record something: <br/>
            <AudioRecorder onChange={this.handleRecording} />
          </label>
        </div>
      </div>
    );
  }
}

export default App;