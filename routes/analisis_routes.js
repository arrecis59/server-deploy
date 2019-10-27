const { Router } = require('express');
const router = Router();
const fetch = require('fetch-base64');
const client = require('../google.js')
const automl = require('@google-cloud/automl').v1beta1;


//ANALIzAR IMAGEN
router.get('/analizarImagen', async(req, res) => {


    //auth cliente
    // const client = new automl.PredictionServiceClient({
    //     keyFilename: '/assets/google_api_key.json'
    // });

    //model details
    const projectId = `deteccion-enfermedades`;
    const computeRegion = `us-central1`;
    // const modelId = `ICN2051895172962079229`;
    const modelId = `ICN4560198087921893376`;
    const scoreThreshold = '0.7';//eficiencia

    //modelpath
    const modelFullId = client.modelPath(projectId, computeRegion, modelId);


    //variables para guardar la imagen
    let urlImg = req.query.img;
    let content;

    //convierte remote URL a base64
    await fetch.remote(`${urlImg}`)
        .then((data) => {

            content = data[0];

        }).catch((reason) => {
            console.log(reason);
        });

    //configuración predicción
    const payload = {};
    payload.image = { imageBytes: content };

    const params = {};

    if (scoreThreshold) {
        params.score_threshold = scoreThreshold;
    }

    //configuración request
    const request = {
        name: modelFullId,
        payload: payload,
        params: params,
    };

    let estado = false;
    let respuesta = [];

    let rest = await client.predict(request, (err, response) => {

        if (response) {
            response.payload.forEach(result => {
                console.log(`Predicted class name: ${result.displayName}`);
                console.log(`Predicted class score: ${result.classification.score}`);

                respuesta.push({ name: result.displayName, score: result.classification.score });
            });
            res.status(200).json({ "enfermedad": respuesta, "status": true });
        } else {
            res.status(500).json({ "message": err, "status": false });
        }
    });

});

module.exports = router;