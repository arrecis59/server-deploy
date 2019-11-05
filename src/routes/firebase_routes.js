const { Router } = require('express');
const router = Router();
const admin = require('../database');
const db = admin.database();

//CONSULTAR SINTOMAS DE LA ENFERMEDAD
router.get('/consultarSintomas', async (req, res) => {

    //Query parameters
    const enfermedad = req.query.enfermedad;

    //Settings request firebase
    const eventRef = db.ref('enfermedades');
    const nameEnfermedad = eventRef.child(`${enfermedad}`);
    const childAdded = nameEnfermedad.child('sintomas');

    //callback
    childAdded.on('value', async (snapShot, err) => {

        if (snapShot.exists()) {

            let resp = await snapShot.val();
            res.status(200).json({ "sintomas": resp, "status": true });

        } else {
            res.status(500).json({ "message": "error al consultar sintomas", "status": false });
        }

    })

});


//CONSULTAR GRAVEDAD ENERMEDAD
router.get('/consultarGravedad',  async(req, res) =>{

    //Query parameters
    const enfermedad = req.query.enfermedad;

    //Settings request firebase
    const eventRef = db.ref('enfermedades');
    const nameEnfermedad = eventRef.child(`${enfermedad}`);
   
    nameEnfermedad.on('value', async (snapShot, err) =>{

        if(snapShot.exists()){
            let resp = await snapShot.val();
            res.status(200).json({"gravedad": resp["gravedad"], "status": true});
        }else{
            res.status(500).json({ "message": "error al consultar gravedad de enfermedad", "status": false });
        }

    });


});


//INSERTAR REGISTRO HISTORIAL
router.post('/insertarHistorial', async (req, res) => {

    //body
    const body = req.body;

    const emailBody = body.email;
    const rutaImgBody = body.rutaImg;
    const fechaBody = body.fecha;
    const ejecucionBody = body.ejecucion;
    const enfermedadBody = body.enfermedad;
    const gravedadBody = body.gravedad;
    const ubicacionBody = body.ubicacion;



    //control
    let saveError = false;
    let updateError = false;
    let vacio = true;

    let newRegister = {
        "email": `${emailBody}`,
        "timeline":
            [
                {
                    "rutaImg": `${rutaImgBody}`,
                    "enfermedad": `${enfermedadBody}`,
                    "gravedad": `${gravedadBody}`,
                    "fecha": `${fechaBody}`,
                    "tiempoEjecucion": `${ejecucionBody}`,
                    "ubicacion": `${ubicacionBody}`
                }
            ]
    }

    let newData = {

        "enfermedad": `${enfermedadBody}`,
        "fecha": `${fechaBody}`,
        "gravedad": `${gravedadBody}`,
        "rutaImg": `${rutaImgBody}`,
        "tiempoEjecucion": `${ejecucionBody}`,
        "ubicacion": `${ubicacionBody}`
    }

    //coleccion historial
    const eventRef = db.ref('historial');


    //verificar si esta vacio el historial
    const value = await eventRef.once('value');

    if (value.exists()) {
        vacio = false;
    }


    if (vacio) {//primer historial

        //Nuevo registro
        await eventRef
            .push()
            .set(newRegister)
            .then(() => {
                console.log('Save to Firebase was successful');
            })
            .catch((error) => {

                saveError = true;
                res.status(500).json({ "message": error, "status": false })
                console.log(error);
            });

    } else { // ya existe un historial

        let key;
        let timeLine = [];

        eventRef.orderByChild('email').equalTo(`${emailBody}`).once('value')
            .then((snapShot) => {

                if (snapShot.exists()) {

                    //optiene id del documento
                    key = Object.keys(snapShot.val())[0];

                    //copia array
                    snapShot.forEach(data => {
                        timeLine = data.val().timeline;
                    });

                    //remplaza por nuevo array
                    timeLine.push(newData);
                    eventRef.child(`${key}`).child('timeline').set(timeLine);

                } else {


                    //Nuevo registro
                    eventRef
                        .push()
                        .set(newRegister)
                        .then(() => {
                            console.log('Save to Firebase was successful');
                        })
                        .catch((error) => {

                            saveError = true;
                            res.status(500).json({ "message": error, "status": false })
                            console.log(error);
                        });

                }

            })
            .catch(err => {
                updateError = true;
                rres.status(500).json({ "message": error, "status": false })
                console.log(error);
            });

    }



    if (!saveError && !updateError) {
        res.status(200).json({ "message": "save to firebase was successful", "status": true })

    } else {
        res.status(500).json({ "message": "error to save on firebase", "status": false })
    }

});


//CONSULTAR HISTORIAL DE USUARIO
router.get('/consultarHistorial', (req, res) => {

    //Req parameters
    const email = req.query.email;



    //coleccion historial
    const eventRef = db.ref('historial');

    let key;
    let timeLine = [];
    let timeLine2 = [];

    eventRef.orderByChild('email').equalTo(`${email}`).once('value')
        .then((snapShot) => {

            if (snapShot.exists()) {

                //copia array
                snapShot.forEach(data => {
                    timeLine = data.val().timeline;
                });

                res.status(200).json({ "historial": timeLine, "status": true })
                

            } else {
                res.status(500).json({ "error": "no existe historial", "status": false })
            }

        })
        .catch(err => {
            updateError = true;
            res.status(500).json({ "message": error, "status": false })
            console.log(error);
        });



});


module.exports = router;