const { Router } = require('express');
const { check } = require('express-validator');
const { mercadoPayment, buySuccesConfirmation } = require('../controllers/pay')

const router = Router();

router.post('/mercadopago', [
    check('amount', 'The amount most be number').isNumeric(),
    check('amount', 'The amount most be empty').not().isEmpty(),
    check('amount', 'The amount id lower than one').isFloat({ min: 1 }),
], mercadoPayment);

router.post('/buySuccess', buySuccesConfirmation);


module.exports = router;