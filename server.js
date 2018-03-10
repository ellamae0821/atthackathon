
require('dotenv').config();
const express         = require('express');
const router          = express.Router();
const bodyParser      = require('body-parser');
const app             = express();
const PORT            = process.env.PORT || 8080;
const axios = require('axios');
const vision = require('node-cloud-vision-api');
vision.init({auth: process.env.VISION_KEY})

const image = './sorrow.jpg'; // or image save from front-end

const visionReq = new vision.Request({
  image: new vision.Image(image),
  features: [
    new vision.Feature('FACE_DETECTION', 4),
    new vision.Feature('LABEL_DETECTION', 10),
  ]
})

function getStats(param){
  let score;
  if(param === 'VERY_LIKELY'){ score = 100 }
  if(param === 'LIKELY'){ score = 90 }
  if(param === 'POSSIBLE'){ score = 80 }
  if(param === 'UNLIKELY'){ score = 30 }
  if(param === 'VERY_UNLIKELY'){ score = 20 }
  if(param === 'UNKNOWN'){ score = 0 }
  return score;
}

app.get('/', (request, res) => {
  vision.annotate(visionReq).then((elem) => {
    let ext = elem.responses[0].faceAnnotations[0];
    let joy = getStats(ext.joyLikelihood);
    let sorrow = getStats(ext.sorrowLikelihood);
    let anger = getStats(ext.angerLikelihood);
    let surprise = getStats(ext.surpriseLikelihood);

    let label_results = elem.responses[0].labelAnnotations;

    console.log('label results', label_results);

    let foundClown = label_results.some(labelObj => {
      return labelObj.description === 'clown';
    });

    console.log('foundClown', foundClown);

    let analysis = [{
        detectionConfidence: ext.detectionConfidence * 100 +'%',
        joy: joy,
        sorrow: sorrow,
        anger: anger,
        surprise: surprise,
      },{
        VERY_LIKELY: 100,
        LIKELY: 90,
        POSSIBLE: 80,
        UNLIKELY: 30,
        VERY_UNLIKELY: 20,
        UNKNOWN: 0
      },{
        joy: 'pink/yellow',
        sorrow: 'blue/grey',
        anger: 'red/purple',
        suprised: 'yellow'
      },{
        highest: undefined,
        clown: undefined
      }]
    let obj = analysis[0]; // emotion object
    let highest = Object.keys(obj).reduce((a, b) => obj[a] > obj[b] ? a : b);
    analysis[3].highest = highest;
    analysis[3].clown = foundClown;

    res.json(analysis);
    }, (e) => {
      console.log('Error: ')
  })
})

app.post("/", (req, res) => {
//handle meee!!! in progress
});




app.get('*', ( req, res ) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});


const server = app.listen(PORT,() => {
  console.log(`Server connected on PORT: ${PORT}`);
});