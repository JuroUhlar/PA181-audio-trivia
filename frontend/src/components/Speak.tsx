import React from 'react';


interface SpeakProps {
    text: string
}

function Speak(props: SpeakProps) {
    return (
        <div className="App">
            <p>{props.text}</p>
            
            <audio  autoPlay id="audio" src={`http://localhost:5000/api/v1/synthesize?text=${props.text}&voice=en-US_AllisonV3Voice&accept=audio/mp3`} controls={true}>
              Your browser does not support the audio element.
            </audio>
        </div>
    );
}

export default Speak;
