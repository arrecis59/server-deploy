const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
    res.status(200).json({ "message": "Bienvenido a la api (detección de enfermedades cutáneas)" });
});

module.exports = router;