const { response } = require('express');
const { Information } = require('../models/information');
const encryptor = require('simple-encryptor')(process.env.ENCRYPTPASSWORD);

const generateUrl = async(req, res = response) => {
    const {bank_transfer=0, crypto_transfer=0, mp_transfer=0, amount, duration='24'} = req
    
    const reqData = {
        bank_transfer,
        crypto_transfer,
        mp_transfer,
        amount,
        duration
    }

    const url = new Information(reqData)
    const lastInformation = await Information.findAll({
        limit: 1,
        where: {
        },
        order: [ [ 'createdAt', 'DESC' ]]
    })
    const lastId = lastInformation[0].id
    //await url.save()
    const encryptedId = encryptor.encrypt(lastId);
    const decrypted = encryptor.decrypt(encryptedId);



    res.json({
        msg: encryptedId
    })
   
}





module.exports = {
    generateUrl,
    
}
