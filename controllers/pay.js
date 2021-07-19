const { response, request } = require('express');
const fetch = require("node-fetch");
const CoinGecko = require('coingecko-api');
const { mpLinkGenerator } = require('../helpers/mpLinkGenerator');
const { Information } = require('../models/information');
const encryptor = require('simple-encryptor')(process.env.ENCRYPTPASSWORD);
const { Op } = require('sequelize');
const { htmlVoucher } = require('../helpers/htmlVoucher');
const sharp = require('sharp');
const { extractPayMethod } = require('../helpers/extractPayMethod');
const {customAxios} = require('../helpers/p2pExtract')
const fs = require('fs');


const mercadoPago = async(req = request, res = response) => {

    const { amount, id: idEncrypted, business_type } = req.body
    const idDecrypted = encryptor.decrypt(idEncrypted);
    const dataFetch = await fetch("https://supersistemasweb.com/TC.php")
    const data = await dataFetch.json()
    const amountArs = amount * data;
    const link = await mpLinkGenerator(idDecrypted, amountArs, business_type)
    res.json({
        msg: link.body.init_point,
    })
}


const dollarToArs = async(req, res) => {
    const {amount} = req.body
    try {
        const dataFetch = await fetch("https://supersistemasweb.com/TC.php")
        const data = await dataFetch.json()
        const amountArs = amount * data;
        res.json({
            msg: amountArs
        })
    } catch (error) {
        res.status(500)({
            msg: 'Internal Server Error'
        })
    }

}

const completedPays = async(req, res) => {
    const {page_number=0, register_quantity=3} = req.query
    try {
        const result = await Information.findAndCountAll({
            where: {
                status: 2,
                [Op.or]: [{crypto_transfer:1}, {mp_transfer: 1}]
            },
            limit: parseInt(register_quantity),
            order: [['updatedAt', 'DESC']],
            offset: parseInt(page_number)
        })
        
        res.json({msg: result})
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: 'Internal server error'
        })
    }


}
const inProgress = async(req, res) => {
    const {page_number=0, register_quantity=3} = req.query
    try {
        const result = await Information.findAndCountAll({
            where: {
                status: 0
            },
            limit: parseInt(register_quantity),
            order: [['updatedAt', 'ASC']],
            offset: parseInt(page_number)
        })
        
        res.json({msg: result})
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: 'Internal server error'
        })
    }
}


const buySuccesConfirmation = async(req, res = response) => {
    const { id: idEncrypted } = req.body
    const idDecrypted = encryptor.decrypt(idEncrypted);
    const dbData = await Information.findByPk(idDecrypted);
    if (dbData) {
        const payMethod = extractPayMethod(dbData)
        if(payMethod === 'Transferencia Bancaria') {
            await dbData.update({
                bank_transfer: 1,
                status: 2
            })
        }
        if(req.body.follow_number_crypto && req.body.chain_id) { // Metamask
            await dbData.update({
                crypto_transfer: 1,
                follow_number_crypto: req.body.follow_number_crypto,
                chain_id: req.body.chain_id,
                status: 2
            })
        }
        if(payMethod === 'Transferencia en binance') {
            await dbData.update({
                binance_transfer: 1,
                status: 2
            })
        }
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
        if (dbData.status === -1) {
            return res.status(406).json({
                msg: 'No payment completed'
            })
        }
        const type = extractPayMethod(dbData)
        const voucherData = {
            date: dbData.updatedAt,
            amount: dbData.amount,
            platform: type,
            encryptedId: idEncrypted,
            status: dbData.status===0?('En Revisión'):('Exitoso')
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
    const { img } = req.files
    const imgArray = (img.length)?(img):([img])
    const { id: idEncrypted } = req.body
    const idDecrypted = encryptor.decrypt(idEncrypted);
    const dbData = await Information.findByPk(idDecrypted);
    let allSuccess=true
    if (dbData) {
        imgArray.forEach((eachImg, eachIndex) => {
            fs.mkdirSync('../transferencia_comprobantes/'+idDecrypted, {
                recursive: true
            });
            if(allSuccess){
                sharp(eachImg.data)
                .resize(1000)
                .png({ compressionLevel: 8 })
                .toFile("../transferencia_comprobantes/"+idDecrypted+"/" + eachIndex+1 + ".png")
                .catch((err)=>{
                    allSuccess = false
                    console.log(err)
                })
            }
            else{
                return res.status(500).json({
                    msg: 'Internal Server Error'
                })
            }
        })
        dbData.update({
            status: 0,
            bank_transfer:1
        })
        .then(()=>{
            return res.json({
                msg: 'Success'
            })
        })
        .catch(()=>{
            return res.status(500).json({
                msg: 'Internal Server Error'
            })
        })
    
    } 
    else {
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

const getValueByP2P = async (req, res =response) => {
    const {asset} = req.query;
    let mediaValue = 0
    const value = await customAxios(asset);
    res.json({
        msg: value
    })
}

const getValueMetamask = async (req, res=response) => {
    const {amount=10, asset="USDT"} = req.query;
    let amountFinal= 0
    try {
        const dataFetch = await fetch("https://supersistemasweb.com/TC.php")
        const data = await dataFetch.json()
        const amountFinal = parseFloat(amount) * data;
        const value = await customAxios(asset);
        const finalValue = (amountFinal/value)*1.005
        const percent = (1 - (finalValue/parseFloat(amount)))*100
        return res.json({
            msg: {metamask: finalValue.toFixed(2), percent: percent.toFixed(2)}
        })
    } catch (error) {
        return res.status(500)({
            msg: 'Internal Server Error'
        })
    }
}


const inProgressCrypto = async (req, res=response) => {
    const { id: idEncrypted, followNumber } = req.body
    const idDecrypted = encryptor.decrypt(idEncrypted);
    const dbData = await Information.findByPk(idDecrypted);
    if (dbData) {
        await dbData.update({
            binance_transfer: 1,
            follow_number_crypto: followNumber,
            status: 1
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


module.exports = {
    mercadoPayment: mercadoPago,
    buySuccesConfirmation,
    buyInProcessConfirmation,
    findByRangeDate,
    getPriceByAmount,
    voucher,
    dollarToArs,
    completedPays,
    inProgress,
    getValueByP2P,
    getValueMetamask,
    inProgressCrypto
}