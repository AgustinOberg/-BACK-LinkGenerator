const { response, request } = require('express');
const mercadopago = require('mercadopago');
const { mpLinkGenerator } = require('../helpers/mpLinkGenerator');



const mercadoPago = async(req = request, res = response) => {

    const { amount } = req.body
    const link = await mpLinkGenerator(amount)
    res.json({
        msg: link.body.init_point,
    })
}

module.exports = {
    mercadoPayment: mercadoPago,

}