const { Information } = require("../models/information");
const fetch = require("node-fetch");

const mpNotify = async (req, res) =>{
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

module.exports={
    mpNotify
}