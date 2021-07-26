const { Router } = require('express');
const { mpNotify } = require('../controllers/notify');


const router = Router();

router.post("/:id/mercadopago/:type/", mpNotify);

module.exports = router;