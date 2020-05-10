if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express')
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1.js');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1.js');
const { IamAuthenticator } = require('ibm-watson/auth');

var cors = require('cors');
var multer = require('multer');
var upload = multer();
var bodyParser = require('body-parser');

const app = express()
const port = process.env.PORT || 5000;

app.enable('trust proxy')
app.use(cors())

app.get('/', (req, res) => res.send('Hello World!'))

/**
 * Pipe the synthesize method
 */
app.get('/api/v1/synthesize', async (req, res, next) => {
  try {
    const { result } = await textToSpeech.synthesize(req.query);
    const transcript = result;
    transcript.on('response', (response) => {
      if (req.query.download) {
        response.headers['content-disposition'] = `attachment; filename=transcript.${getFileExtension(req.query.accept)}`;
      }
    });
    transcript.on('error', next);
    transcript.pipe(res);
  } catch (error) {
    res.send(error);
  }
});

// for parsing application/json
app.use(bodyParser.json());

// for parsing multipart/form-data
app.use(upload.array());
app.use(express.static('public'));

app.post('/api/v1/recognize',(req, res, next) => {
  console.log("in recognize");
  try {
    console.log("in try");
    console.log(req.body);
    var list = ["item1", "item2", "item3"];
    res.json(list);
  } catch (error) {
    console.log("in err");
    res.send(error);
  }
});



const textToSpeech = new TextToSpeechV1({
  version: '2018-04-05',
  authenticator: new IamAuthenticator({
    apikey: process.env.TEXT_TO_SPEECH_IAM_APIKEY || 'type-key-here',
  }),
  url: process.env.TEXT_TO_SPEECH_URL,
});


const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.SPEECH_TO_TEXT_IAM_APIKEY || 'type-key-here',
  }),
  url: process.env.SPEECH_TO_TEXT_URL,
});

// var fs = require('fs');
// const recognizeParams = {
//   audio: fs.createReadStream('hello_world.wav'),
//   contentType: 'audio/wav',
//   wordAlternativesThreshold: 0.9,
//   keywords: ['hello', 'world'],
//   keywordsThreshold: 0.5,
// };
//
// speechToText.recognize(recognizeParams)
//     .then(speechRecognitionResults => {
//       console.log(JSON.stringify(speechRecognitionResults, null, 2));
//     })
//     .catch(err => {
//       console.log('error:', err);
//     });

const getFileExtension = (acceptQuery) => {
  const accept = acceptQuery || '';
  switch (accept) {
    case 'audio/ogg;codecs=opus':
    case 'audio/ogg;codecs=vorbis':
      return 'ogg';
    case 'audio/wav':
      return 'wav';
    case 'audio/mpeg':
      return 'mpeg';
    case 'audio/webm':
      return 'webm';
    case 'audio/flac':
      return 'flac';
    default:
      return 'mp3';
  }
};

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

// Example API call: http://localhost:5000/api/v1/synthesize?text=Hello%20cruel%20world&voice=en-US_AllisonV3Voice&accept=audio%2Fmp3
