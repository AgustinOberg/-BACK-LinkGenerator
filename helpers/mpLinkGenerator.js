const mercadopago = require('mercadopago');

const mpLinkGenerator = async(id, amount, type) => {

    mercadopago.configure({
        access_token: type===0?(process.env.MERCADOPAGOTOKEN_0):(process.env.MERCADOPAGOTOKEN_1)
    });
    const preference = {
        payment_methods: {
            installments: 1,
            excluded_payment_types: [
                {
                    "id": "ticket"
                },
                {
                    "id": "atm"
                }
            ]
        },
        items: [{
            title: 'SUPERSISTEMASWEB',
            unit_price: amount,
            quantity: 1,
        }],
        notification_url: `https://pagosx.com/api/notify/${id}/mercadopago/${type}/`,
        

    };
    const url = await mercadopago.preferences.create(preference)
    return url
}

module.exports = {
    mpLinkGenerator
}