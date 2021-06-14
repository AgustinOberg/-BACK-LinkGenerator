const { Router } = require('express');
const { check } = require('express-validator');
const { mercadoPayment, buySuccesConfirmation, buyInProcessConfirmation, findByRangeDate, getPriceByAmount } = require('../controllers/pay')
const { fieldValidate } = require('../middlewares/field-validate');

const router = Router();

router.post('/mercadopago', [
    check('amount', 'The amount must be number').isNumeric(),
    check('amount', "The amount must'n be empty").not().isEmpty(),
    check('amount', 'The amount id lower than one').isFloat({ min: 1 }),
    fieldValidate
], mercadoPayment);

router.put('/buySuccess', buySuccesConfirmation);

router.put('/buyInProcess', buyInProcessConfirmation);

router.post('/findByRangeDate', [
    check('initDate', "The initDate must'n be empty").not().isEmpty(),
    fieldValidate
], findByRangeDate);

router.get('/priceByAmount/:amount', getPriceByAmount);

module.exports = router;