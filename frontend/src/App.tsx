import React from 'react';

import './App.css';
import Speak from './components/Speak';
// @ts-ignore
import Recorder from 'react-mp3-recorder'

interface AppState {
  text: string
  recordedText: string
}

const levenshtein = require('js-levenshtein');

export class App extends React.Component<any, AppState> {

  constructor(props: any) {
    super(props);
    this.input = React.createRef();
    this.state = {
      text: 'Say something',
      recordedText: '',
	  question: '',
	  incorrectAnswers: [],
	  correctAnswer: '',
	  mixedAnswers: [],
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
		this.state.mixedAnswers.map((ans) => {
			console.log(levenshtein(this.state.recordedText, ans));
		});
    }
  };

  _onRecordingError = (err: any) => {
    console.log('recording error', err)
  };
  //  Getne otazku - replace je kvůli tomu, že mi přijde &quot místo " a podobně,
  //  nevěděl jsem jak to rychle po par pokusech jednoduše rozkodovat, tak je to takto skarede
  //  takze to chce predelat
  getQuestion = () => {
	fetch('https://opentdb.com/api.php?amount=1&type=multiple')
		.then(response => response.json())
		.then(data => this.setState({ 
			question: data.results[0].question.replace(/&quot;/g, '"').replace(/&#039;/g, '\''),
			correctAnswer: data.results[0].correct_answer.replace(/&quot;/g, '"').replace(/&#039;/g, '\''),
			incorrectAnswers: data.results[0].incorrect_answers.map(x => x.replace(/&quot;/g, '"').replace(/&#039;/g, '\'')),
			mixedAnswers: [...data.results[0].incorrect_answers.map(x => x.replace(/&quot;/g, '"').replace(/&#039;/g, '\''))]
						  .concat(data.results[0].correct_answer.replace(/&quot;/g, '"').replace(/&#039;/g, '\'')).sort(() => 0.5 - Math.random())
		}));
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
		
        <div id='triviaAPI'>
          <label>
			<br />
			<h1> Get question from triviaAPI</h1> 
			<button onClick={this.getQuestion}>Get question</button>
			<br/> Question is: <br/>
			<Speak text={this.state.question + " " + this.state.mixedAnswers.join("? or ") } />
          </label>
		  
        </div>
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