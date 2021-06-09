const { response, request } = require('express');
const mercadopago = require('mercadopago');
const { mpLinkGenerator } = require('../helpers/mpLinkGenerator');
const { Information } = require('../models/information');
const encryptor = require('simple-encryptor')(process.env.ENCRYPTPASSWORD);
const { Op } = require('sequelize');



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
    if (dbData) {
        await dbData.update({
            status: 2
        })
        return res.json({
            msg: "Success"
        })
    } else {
        return res.status(404).json({
            msg: "Link not found"
        })
    }
}

const buyInProcessConfirmation = async(req, res = response) => {
    const idEncrypted = req.body.id
    const idDecrypted = encryptor.decrypt(idEncrypted);
    const dbData = await Information.findByPk(idDecrypted);
    if (dbData) {
        await dbData.update({
            status: 1
        })
        return res.json({
            msg: "Success"
        })
    } else {
        return res.status(404).json({
            msg: "Link not found"
        })
    }
}

const findByRangeDate = async(req, res = response) => {
    const { initDate, finishDate = Date.now() } = req.body;
    const dbData = await Information.findAll({
        where: {
            "updatedAt": {
                [Op.between]: [initDate, finishDate]
            }
        }
    })
    return res.json({
        msg: dbData
    })
}

module.exports = {
    mercadoPayment: mercadoPago,
    buySuccesConfirmation,
    buyInProcessConfirmation,
    findByRangeDate
}