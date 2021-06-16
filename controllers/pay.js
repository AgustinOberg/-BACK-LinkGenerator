const { response, request } = require('express');
const axios = require('axios');
const fetch = require("node-fetch");
const mercadopago = require('mercadopago');
const CoinGecko = require('coingecko-api');
const { mpLinkGenerator } = require('../helpers/mpLinkGenerator');
const { Information } = require('../models/information');
const encryptor = require('simple-encryptor')(process.env.ENCRYPTPASSWORD);
const { Op } = require('sequelize');
const { htmlVoucher } = require('../helpers/htmlVoucher');
var base64ToImage = require('base64-to-image');



const mercadoPago = async(req = request, res = response) => {

    const { amount, id: idEncrypted } = req.body
    const idDecrypted = encryptor.decrypt(idEncrypted);
    const link = await mpLinkGenerator(idDecrypted, amount)
    res.json({
        msg: link.body.init_point,
    })
}

const buySuccesConfirmation = async(req, res = response) => {
    const { id: idEncrypted } = req.body
    const idDecrypted = encryptor.decrypt(idEncrypted);
    const dbData = await Information.findByPk(idDecrypted);
    if (dbData) {
        await dbData.update({
            [req.body.type]: 1,
            status: 2
        })
        return res.json({
            msg: 'Success!'
        })

    } else {
        return res.status(404).json({
            msg: "Link not found"
        })
    }


}

const voucher = async(req, res) => {
    const { id: idEncrypted } = req.body
    const idDecrypted = encryptor.decrypt(idEncrypted);
    const dbData = await Information.findByPk(idDecrypted);
    if (dbData) {
        if (dbData.bank_transfer !== 1 && dbData.crypto_transfer !== 1 && dbData.mp_transfer !== 1) {
            return res.status(406).json({
                msg: 'No payment completed'
            })
        }
        const voucherData = {
            date: dbData.updatedAt,
            amount: dbData.amount,
            platform: type,
            encryptedId: idEncrypted
        }
        return res.pdfFromHTML({
            filename: 'generated.pdf',
            htmlContent: htmlVoucher(voucherData),
        });
    } else {
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

const buyInProcessConfirmation = async(req, res = response) => {
    const { id: idEncrypted, img } = req.body
    const idDecrypted = encryptor.decrypt(idEncrypted);
    const dbData = await Information.findByPk(idDecrypted);
    if (dbData) {
        await dbData.update({
            status: 0
        })
        const base64Str = img;
        const path = __dirname + "/../../transferencia_comprobantes/";
        const optionalObj = { 'fileName': idDecrypted, 'type': 'png' };
        await base64ToImage(base64Str, path, optionalObj);
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

const getPriceByAmount = async(req, res = response) => {
    const CoinGeckoClient = new CoinGecko();
    const data = await CoinGeckoClient.simple.price({
        ids: ['ethereum'],
        vs_currencies: ['usd'],
    });
    const { amount } = req.params;
    const result = parseFloat(amount) / parseFloat(data.data.ethereum.usd)

    res.json({
        msg: result
    })
}

const mercadopagoBuy = async(req, res = response) => {
    res.status(200).json({

    })
    if (req.body.data) {
        const { id } = req.params;
        const dbData = await Information.findByPk(id);

        const { id: idMp } = req.body.data;
        const token = process.env.MERCADOPAGOTOKEN;


        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        const fetchResponse = await fetch(`https://api.mercadopago.com/v1/payments/${idMp}?access_token=${token}`, requestOptions)

        const fetchData = await fetchResponse.json()

        if (fetchData.status === "approved") {
            await dbData.update({
                mp_transfer: 1,
                status: 2
            })
        }
    }
}



module.exports = {
    mercadoPayment: mercadoPago,
    buySuccesConfirmation,
    buyInProcessConfirmation,
    findByRangeDate,
    getPriceByAmount,
    voucher,
    mercadopagoBuy
}