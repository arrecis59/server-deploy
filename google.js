const automl = require('@google-cloud/automl').v1beta1;

const client = new automl.PredictionServiceClient({
    keyFilename: './assets/google_api_key.json'
});


module.exports = client;