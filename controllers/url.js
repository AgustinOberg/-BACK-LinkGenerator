const { response } = require('express')
const { Information } = require('../models/information')
const encryptor = require('simple-encryptor')(process.env.ENCRYPTPASSWORD)
const { mpLinkGenerator } = require('../helpers/mpLinkGenerator')



const generateUrl = async(req, res = response) => {
    const { bank_transfer = -1, crypto_transfer = -1, mp_transfer = -1, amount, duration = '24' } = req.body

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
    let lastId
    if (lastInformation.length > 0) {
        lastId = lastInformation[0].id
    } else {
        lastId = 0
    }
    const encryptedId = encryptor.encrypt(lastId + 1)

    const newRegister = new Information({...reqData, url: process.env.HOSTURL + encryptedId })

    await newRegister.save()

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