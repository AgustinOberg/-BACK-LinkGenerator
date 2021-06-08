const { response, request } = require('express');
const mercadopago = require('mercadopago');
const { mpLinkGenerator } = require('../helpers/mpLinkGenerator');
const { Information } = require('../models/information');
const encryptor = require('simple-encryptor')(process.env.ENCRYPTPASSWORD)



const mercadoPago = async(req = request, res = response) => {

    const { amount } = req.body
    const link = await mpLinkGenerator(amount)
    res.json({
        msg: link.body.init_point,
    })
}

const buySuccesConfirmation = async(req, res = response) => {
    const idEncrypted = req.body.id
    const idDecrypted = encryptor.decrypt(idEncrypted);
    const dbData = await Information.findByPk(idDecrypted);
    console.log(dbData)
    await dbData.update({
        status: 2
    })
    res.json({
        msg: "Success"
    })
}

module.exports = {
    mercadoPayment: mercadoPago,
    buySuccesConfirmation,

}