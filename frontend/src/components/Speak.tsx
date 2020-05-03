import React, { useEffect } from 'react';
import TextToSpeechV1 from 'ibm-watson/text-to-speech/v1';
import { IamAuthenticator } from 'ibm-watson/auth';
import fs from 'fs';

interface SpeakProps {
    text: string
}

function Speak(props: SpeakProps) {

    useEffect(() => {
        console.log(props.text);
        textToSpeech.synthesize(synthesizeParams)
            .then((audio:any) => {
                // audio.pipe(fs.createWriteStream('hello_world.wav'));
                console.log(audio);
            })
            .catch(err => {
                console.log('error:', err);
            });
    })

    return (
        <div className="App">
            <p>{props.text}</p>
        </div>
    );
}

export default Speak;




const textToSpeech = new TextToSpeechV1({
    authenticator: new IamAuthenticator({
        apikey: 'Kz04mXxH-XPCxuc1YSwJz06genlnu1ozXFngAJqANbuO',
    }),
    url: 'https://api.eu-gb.text-to-speech.watson.cloud.ibm.com/instances/48095276-0ee2-4da8-b8be-35ae84a4371c/',
});

const synthesizeParams = {
    text: 'Hello world',
    accept: 'audio/wav',
    voice: 'en-US_AllisonVoice',
};