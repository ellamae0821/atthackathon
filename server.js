
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const app = express();
const PORT = 8888;

// Connect and configure AWS
const AWS = require('aws-sdk');
const AWS = require('aws-sdk/global');
AWS.config.update({region: 'us-east-1'});

app.use(bodyParser.urlencoded({ extended: true }));

const rekognition = new AWS.Rekognition();

app.get('/', ( req, res ) =>{
  res.json('Smoke Test');
});
/*
app.get('/', function(req, res, next) {
  rekognition.recognizeFace(params, function (err, data) {
    if (err) console.log(err, err.stack);
      else {
      name = data.screenshotFace[0].Name;
      id = data.screenshotFace[0].Urls[0].match(/nm(.*)/)[0];
      res.send(name)
    }
  });
});
*/


const server = app.listen(PORT,() => {
  console.log(`Server connected on PORT: ${PORT}`);
});