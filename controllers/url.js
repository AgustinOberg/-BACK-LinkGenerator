const { response } = require('express')
const { Information } = require('../models/information')
const encryptor = require('simple-encryptor')(process.env.ENCRYPTPASSWORD)
const { mpLinkGenerator } = require('../helpers/mpLinkGenerator')


const generateUrl = async(req, res = response) => {
    const { bank_transfer = 0, crypto_transfer = 0, mp_transfer = 0, amount, duration = '24' } = req.body

    const reqData = {
        bank_transfer,
        crypto_transfer,
        mp_transfer,
        amount,
        duration
    }

    const lastInformation = await Information.findAll({
        limit: 1,
        where: {},
        order: [
            ['createdAt', 'DESC']
        ]
    })
    const lastId = lastInformation.length > 0 ? lastInformation[0].id : 0
    const encryptedId = encryptor.encrypt(lastId + 1)

    const newRegister = new Information({...reqData, url: process.env.hostUrl + encryptedId })

    await newRegister.save()

    if (mp_transfer === 1) { //MercadoPago
        const mpLink = await mpLinkGenerator(amount)
        return res.json({
            msg: {
                newRegister,
                mercadoPago: mpLink.body.init_point
            }
        })
    }
    res.json({
        msg: {
            newRegister
        }
    })
}

const selectByEncryptedId = async(req, res = response) => {
    const idEncrypted = req.body.id
    const idDecrypted = encryptor.decrypt(idEncrypted);
    const dbData = await Information.findByPk(idDecrypted);
    res.json({
        msg: dbData
    })
}

const selectById = async(req, res = response) => {
    const dbData = await Information.findByPk(req.params.id);
    res.json({
        msg: dbData
    })
}



module.exports = {
    generateUrl,
    selectByEncryptedId,
    selectById
}