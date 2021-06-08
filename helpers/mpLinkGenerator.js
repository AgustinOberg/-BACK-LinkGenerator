const mercadopago = require('mercadopago');

const mpLinkGenerator = async(amount) => {

    mercadopago.configure({
        access_token: process.env.MERCADOPAGOTOKEN
    });
    const preference = {
        items: [{
            title: 'SUPERSISTEMASWEB',
            unit_price: amount,
            quantity: 1,
        }],
        back_urls: {
            success: 'https://www.google.com/search?q=success+page&rlz=1C1ALOY_esAR944AR944&oq=succes&aqs=chrome.0.69i59j69i57j0i20i263i457j0i395i433j46i395i433j0i433j69i60l2.1813j1j4&sourceid=chrome&ie=UTF-8',
            failure: 'https://www.google.com/search?q=ErrorDocument&rlz=1C1ALOY_esAR944AR944&oq=error&aqs=chrome.0.69i59j69i57j69i59j0i433j0i395i433j69i61l2j69i60.416j1j9&sourceid=chrome&ie=UTF-8',
            pending: 'https://www.google.com/search?q=pending&rlz=1C1ALOY_esAR944AR944&oq=pending&aqs=chrome..69i57j35i39j35i19i39j0i433j69i60j69i61j69i60l2.536j1j9&sourceid=chrome&ie=UTF-8'
        },
        auto_return: 'approved'
    };

    const url = await mercadopago.preferences.create(preference)
    return url

}

module.exports = {
    mpLinkGenerator
}