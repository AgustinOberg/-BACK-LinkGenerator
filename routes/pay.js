const { Router } = require('express');
const { check } = require('express-validator');
const { mercadoPayment } = require('../controllers/pay')

const router = Router();

router.post('/mercadopago',mercadoPayment );




module.exports = router;