import React from 'react';

import './App.css';
import Speak from './components/Speak';
// @ts-ignore
import Recorder from 'react-mp3-recorder'
import { runInThisContext } from 'vm';
const levenshtein = require('js-levenshtein');

interface AppState {
  text: string,
  recordedText: string,
  question: string,
  incorrectAnswers: string[],
  correctAnswer: string,
  mixedAnswers: string[],
  outcome: string,
}

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
    outcome: '',
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
                recordedText: response.result.results[response.result.results.length-1].alternatives[0].transcript,
                outcome: this.getOutcome(response.result.results[response.result.results.length-1].alternatives[0].transcript)
              }))}
          });
    }
  };
  getOutcome(recordedText)
  {
    switch (recordedText.trim()) {
      case "a":
      case "hey":
      case "hey you":
      case "our":
      case "A.":
      case "eight":
        if (this.getIndex(this.state.correctAnswer, this.state.mixedAnswers) == 0)
          return ("Correct!");
        else 
          return ("Incorrect!");
      case "b":
      case "bee":
      case "be":
      case "e":
      case "B.":
        if (this.getIndex(this.state.correctAnswer, this.state.mixedAnswers) == 1)
          return ("Correct!");
        else 
          return ("Incorrect!");
      case "c":
      case "see":
      case "sea":
      case "ce":
      case "C.":
        if (this.getIndex(this.state.correctAnswer, this.state.mixedAnswers) == 2)
          return ("Correct!");
        else 
          return ("Incorrect!");
      case "d":
      case "deer":
      case "dear":
      case "de":
      case "D.":
        if (this.getIndex(this.state.correctAnswer, this.state.mixedAnswers) == 3)
          return ("Correct!");
        else 
          return ("Incorrect!");
      case "Question.":
      case "Questions.":
      case "question":
      case "questions":
      case "Christian.":
      case "christian":
      {
        this.getQuestion();
        return ("");
      }  
      default: 
          return('Unable to process! Please, try to record your answer again!');
    }
  }
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
      recordedText:"",
      question: data.results[0].question.replace(/&quot;/g, '"').replace(/&#039;/g, '\''),
			correctAnswer: data.results[0].correct_answer.replace(/&quot;/g, '"').replace(/&#039;/g, '\''),
			incorrectAnswers: data.results[0].incorrect_answers.map(x => x.replace(/&quot;/g, '"').replace(/&#039;/g, '\'')),
			mixedAnswers: [...data.results[0].incorrect_answers.map(x => x.replace(/&quot;/g, '"').replace(/&#039;/g, '\''))]
						  .concat(data.results[0].correct_answer.replace(/&quot;/g, '"').replace(/&#039;/g, '\'')).sort(() => 0.5 - Math.random())
		}));
  };
  
   getIndex(value, arr) {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i] === value) {
            return i;
        }
    }
    return -1; 
};

  render() {
    const answers = this.state.mixedAnswers.map((item) =>
    <li>{item}</li>
    );
    return (
      <div className="App">
        <h1>Audio trivia </h1>
        Toto kdyz zkusim schovat, tak to haze error, nevim proc
        <form onSubmit={this.handleSubmit}>
          <label>
            Say something: <br/>
            <input type="text" ref={this.input} id='textInput'/>
          </label>
          <input type="submit" value="Submit" />
        </form>


		
    <div id='triviaAPI'>
    <label>
			<br />
			<h1> Get question from triviaAPI!</h1> 
			  <button onClick={this.getQuestion}>Get question</button>
			<br/> Question is: <br/>
      <Speak text={this.state.question + " " + this.state.mixedAnswers.join("? or ") + "?"}  />
          </label>
		  
        </div>
		<div id='voiceRecord'>
          <Recorder
              onRecordingComplete={this._onRecordingComplete}
              onRecordingError={this._onRecordingError}
          />
          <label>
            <br/> Click and Hold to record <br/>
            Correct answer: {this.state.correctAnswer} <br/>
            You have said: <b>{this.state.recordedText}</b>
            <br/>
              Outcome:  <Speak text={this.state.outcome}  />
          </label>
          <ol type="a">
              {answers}
            </ol>
        </div>

      </div>
    );
  }
}

export default App;