const { Router } = require('express');
const { check } = require('express-validator');
const { mercadoPayment, dollarToArs, buySuccesConfirmation, buyInProcessConfirmation, findByRangeDate, getPriceByAmount, voucher, completedPays, inProgress } = require('../controllers/pay')
const { fieldValidate } = require('../middlewares/field-validate');

const router = Router();

router.post('/mercadopago', [
    check('amount', 'The amount must be number').isNumeric(),
    check('amount', "The amount must'n be empty").not().isEmpty(),
    check('amount', 'The amount id lower than one').isFloat({ min: 1 }),
    check('business_type', "The business_type must'n be empty").not().isEmpty(),
    check('business_type', "The business_type must be number").isNumeric(),
    check('id', "The id must'n be empty").not().isEmpty(),
    fieldValidate
], mercadoPayment);

router.put('/buySuccess', [
    check('id', "The id must'n be empty").not().isEmpty(),
    fieldValidate
], buySuccesConfirmation);

router.put('/buyInProcess', [
    check('id', "The id must'n be empty").not().isEmpty(),
    fieldValidate
], buyInProcessConfirmation);

router.put('/voucher', [
    check('id', "The id must'n be empty").not().isEmpty(),
    fieldValidate
], voucher);

router.post('/findByRangeDate', [
    check('initDate', "The initDate must'n be empty").not().isEmpty(),
    fieldValidate
], findByRangeDate);

router.get('/priceByAmount/:amount', getPriceByAmount);

router.get('/completed', completedPays);

router.get('/inProgress', inProgress);

router.post('/dollarToArs', [
    check('amount', 'The amount must be number').isNumeric(),
    check('amount', "The amount must'n be empty").not().isEmpty(),
    fieldValidate
] , dollarToArs);



module.exports = router;