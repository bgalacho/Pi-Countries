const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const CountryResource = require('../resources/Country');
const ActivityResource = require('../resources/Activity');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get('/countries', CountryResource.getCountries);
router.get('/countries/:id', CountryResource.getCountryById);
router.get('/activities', ActivityResource.getActivity);
router.post('/activity', ActivityResource.createActivityValidation, ActivityResource.createActivity);


module.exports = router;
