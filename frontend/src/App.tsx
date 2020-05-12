import React from 'react';

import './App.css';
import Speak from './components/Speak';
// @ts-ignore
import Recorder from 'react-mp3-recorder'

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


  _onRecordingComplete = (blob: string | Blob | null) => {
    console.log('recording', blob);
    if(blob !== null) {
      let fd = new FormData();
      fd.append('audio',blob);

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

  _onRecordingError = (err: any) => {
    console.log('recording error', err)
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
          <Recorder
              onRecordingComplete={this._onRecordingComplete}
              onRecordingError={this._onRecordingError}
          />
          <label>
            <br/> Click and Hold to record <br/>
            You have said: <b>{this.state.recordedText}</b>
          </label>
        </div>

      </div>
    );
  }
}

export default App;