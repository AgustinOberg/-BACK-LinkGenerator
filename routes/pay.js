const { Router } = require('express');
const { check } = require('express-validator');
const { mercadoPayment, dollarToArs, buySuccesConfirmation, buyInProcessConfirmation, findByRangeDate, getPriceByAmount, voucher, completedPays, inProgress, getValueByP2P, getValueMetamask, inProgressCrypto, completedCrypto, checkState, dolarToCrypto, getTransaction } = require('../controllers/pay')
const { fieldValidate } = require('../middlewares/field-validate');

const router = Router();

router.post('/mercadopago', [
    check('amount', 'The amount must be number').isNumeric(),
    check('amount', "The amount must'n be empty").not().isEmpty(),
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

router.get('/getValueFromBinanceP2P', getValueByP2P)

router.get('/getValueForMetamask', getValueMetamask)

// router.get('/transferCheck/:hash/:account/:id', checkState)

router.get('/getTransferCrypto/:id', [
    check('id', "The id is required").not().isEmpty(),
    fieldValidate
], getTransaction)

router.put('/buyinProgress/crypto', [
    check('id', "The id is required").not().isEmpty(),
    check('followNumber', "The followNumber is required").not().isEmpty(),
    fieldValidate
], inProgressCrypto)


module.exports = router;