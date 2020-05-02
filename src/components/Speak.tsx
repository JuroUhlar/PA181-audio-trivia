import React from 'react';

interface SpeakProps {
    text: string
}

function Speak(props: SpeakProps) {
  return (
    <div className="App">
       <p>{props.text}</p>
    </div>
  );
}

export default Speak;
