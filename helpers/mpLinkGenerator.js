const mercadopago = require('mercadopago');

const mpLinkGenerator = async(id, amount, encryptedId) => {

    mercadopago.configure({
        access_token: process.env.MERCADOPAGOTOKEN
    });
    const preference = {
        payment_methods: {
            installments: 1
        },
        items: [{
            title: 'SUPERSISTEMASWEB',
            unit_price: amount,
            quantity: 1,
        }],
        back_urls: {
            success: `${process.env.HOSTURL + encryptedId}`,
            failure: `${process.env.HOSTURL + encryptedId}`,
            pending: `${process.env.HOSTURL + encryptedId}`
        },
        auto_return: 'approved',
        notification_url: `http://pagosx.com:8080/api/notify/${id}/mercadopago/`,
        

    };
    const url = await mercadopago.preferences.create(preference)
    return url
}

module.exports = {
    mpLinkGenerator
}