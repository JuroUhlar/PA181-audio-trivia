import React from 'react';

import './App.css';
import Speak from './components/Speak';
import AudioRecorder from 'react-audio-recorder';

interface AppState {
  text: string
  recordedText: string
}

export class App extends React.Component<any, AppState> {

  constructor(props: any) {
    super(props);
    this.input = React.createRef();
    this.state = {
      text: 'Say something',
      recordedText: ''
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
    }));
    input.value = '';
    event.preventDefault();
  };

  handleRecord = (event: any) => {
    if (event.audioData != null) {
      let fd = new FormData();
      fd.append('audio', event.audioData);

      fetch('http://localhost:5000/api/v1/recognize', {
        headers: { Accept: "application/json"  },
        method: "POST", body: fd
      }).then(response => response.json())
        .then(response => {
          if(response.result.results.length !== 0){
            this.setState(() => ({
              recordedText: response.result.results[response.result.results.length-1].alternatives[0].transcript
          }))}
        });
    }
  };

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
            <AudioRecorder onChange={this.handleRecord} /> <br/>
            You have said: <b>{this.state.recordedText}</b>
          </label>

        </div>
      </div>
    );
  }
}

export default App;