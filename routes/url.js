const { Router } = require('express');
const { check } = require('express-validator');
const { generateUrl, selectByEncryptedId, selectById } = require('../controllers/url');
const { fieldValidate } = require('../middlewares/field-validate');
const router = Router();

router.post('/generate', [
    check('amount', 'The amount most be number').isNumeric(),
    check('amount', 'The amount most be empty').not().isEmpty(),
    check('amount', 'The amount id lower than one').isFloat({ min: 1 }),
    check('bank_transfer', 'The bank_transfer most be number').isNumeric(),
    check('crypto_transfer', 'The crypto_transfer most be number').isNumeric(),
    check('mp_transfer', 'The mp_transfer most be number').isNumeric(),
    check('duration', 'The duration most be number').isNumeric(),
    check('duration', 'The duration id lower than one').isFloat({ min: 1 }),
    fieldValidate
], generateUrl);

router.get('/', generateUrl);

router.get('/:id', selectById);

router.post('/desencrypt', [
    check('id', 'The id most be empty').not().isEmpty(),
    fieldValidate
], selectByEncryptedId);








module.exports = router;