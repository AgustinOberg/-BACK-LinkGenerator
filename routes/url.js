const { Router } = require('express');
const { check } = require('express-validator');
const { generateUrl } = require('../controllers/url');


const router = Router();

router.post('/generate',generateUrl );

router.get('/',generateUrl );

router.get('/:id',generateUrl );







module.exports = router;