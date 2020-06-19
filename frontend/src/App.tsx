import React from 'react';

import './App.css';
import Speak from './components/Speak';
// @ts-ignore
import Recorder from 'react-mp3-recorder';
import { serverURL } from './config';
import he from 'he';

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

  // componentDidMount() {
  //   setTimeout(() => {
  //     this.getQuestion();
  //   }, 0);
  // };

  //  Getne otazku - replace je kvůli tomu, že mi přijde &quot místo " a podobně,
  //  nevěděl jsem jak to rychle po par pokusech jednoduše rozkodovat, tak je to takto skarede
  //  takze to chce predelat
  getQuestion = () => {
    fetch('https://opentdb.com/api.php?amount=1&type=multiple')
      .then(response => response.json())
      .then(data => {
        let questionInfo = data.results[0];
        let question =  he.decode(questionInfo.question);
        let correctAnswer = he.decode(questionInfo.correct_answer);
        let incorrectAnswers = questionInfo.incorrect_answers.map((answer:any) => he.decode(answer));
        let mixedAnswers = incorrectAnswers.concat(correctAnswer).sort(() => 0.5 - Math.random());
        this.setState({
          recordedText: '',
          question,
          correctAnswer,
          incorrectAnswers,
          mixedAnswers,
        });
      })
  };

  _onRecordingComplete = (blob: string | Blob | null) => {
    console.log('recording', blob);
    if (blob !== null) {
      let fd = new FormData();
      fd.append('audio', blob);

      fetch(`${serverURL}/api/v1/recognize`, {
        headers: { Accept: "application/json" },
        method: "POST", body: fd
      }).then(response => response.json())
        .then(response => {
          if (response.result.results.length !== 0) {
            this.setState(() => ({
              recordedText: response.result.results[response.result.results.length - 1].alternatives[0].transcript,
              outcome: this.getOutcome(response.result.results[response.result.results.length - 1].alternatives[0].transcript)
            }))
          }
        });
    }
  };

  getOutcome(recordedText: any) {
    switch (recordedText.trim()) {
      case "a":
      case "hey":
      case "Hey":
      case "hey you":
      case "our":
      case "A.":
      case "eight":
        if (this.getIndex(this.state.correctAnswer, this.state.mixedAnswers) === 0)
          return ("Correct!");
        else
          return ("Incorrect!");
      case "b":
      case "bee":
      case "be":
      case "e":
      case "B.":
        if (this.getIndex(this.state.correctAnswer, this.state.mixedAnswers) === 1)
          return ("Correct!");
        else
          return ("Incorrect!");
      case "c":
      case "see":
      case "sea":
      case "ce":
      case "C.":
        if (this.getIndex(this.state.correctAnswer, this.state.mixedAnswers) === 2)
          return ("Correct!");
        else
          return ("Incorrect!");
      case "d":
      case "deer":
      case "dear":
      case "de":
      case "D.":
      case "T.":
      case "the":
      case "The":
        if (this.getIndex(this.state.correctAnswer, this.state.mixedAnswers) === 3)
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
        return ('Unable to process! Please, try to record your answer again!');
    }
  }
  _onRecordingError = (err: any) => {
    console.log('recording error', err)
  };


  getIndex(value: any, arr: any) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === value) {
        return i;
      }
    }
    return -1;
  };

  render() {
    const answers = this.state.mixedAnswers.map((item) =>
      <li key={item}>{item}</li>
    );
    const question = `${this.state.question} a) ${this.state.mixedAnswers[0]}, b) ${this.state.mixedAnswers[1]}, c) ${this.state.mixedAnswers[2]}, d) ${this.state.mixedAnswers[3]}`
    return (
      <div className="App">
        <div id='triviaAPI'>
          <h1> Audio trivia game</h1>
          <button onClick={this.getQuestion}> {this.state.question === '' ? 'Start game' : 'Get next question'}</button>
          <br /> Question is: <br />
          {this.state.question !== '' && <Speak text={question} />}

        </div>
        <div id='voiceRecord'>
          <Recorder
            onRecordingComplete={this._onRecordingComplete}
            onRecordingError={this._onRecordingError}
          />
          <label>
            <br /> Click and Hold to record <br />
            Correct answer: {this.state.correctAnswer} <br />
            You have said: <b>{this.state.recordedText}</b>
            <br />
              Outcome:
              {this.state.outcome !== '' && <Speak text={`${this.state.outcome} The answer is ${this.state.correctAnswer}.`} />}
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