const { response } = require('express')
const { Information } = require('../models/information')
const encryptor = require('simple-encryptor')(process.env.ENCRYPTPASSWORD)
const {mpLinkGenerator} = require('../helpers/mpLinkGenerator')


const generateUrl = async(req, res = response) => {
    const {bank_transfer=0, crypto_transfer=0, mp_transfer=0, amount, duration='24'} = req.body
    
    const reqData = {
        bank_transfer,
        crypto_transfer,
        mp_transfer,
        amount,
        duration
    }
    
    const lastInformation = await Information.findAll({
        limit: 1,
        where: {
        },
        order: [ [ 'createdAt', 'DESC' ]]
    })
    const lastId = lastInformation[0].id
    const encryptedId = encryptor.encrypt(lastId)

    const newRegister = new Information({...reqData, url:process.env.hostUrl+encryptedId})
    await newRegister.save()

    if(mp_transfer===1){            //MercadoPago
        const mpLink = await mpLinkGenerator(amount)
        res.json({
            msg: {
                newRegister,
                mercadoPago:mpLink.body.init_point
            }
        })
    }


}





module.exports = {
    generateUrl,
    
}
