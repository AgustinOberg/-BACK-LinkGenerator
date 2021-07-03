const extractPayMethod = (data) => {
    if(data.bank_transfer != 0){
        return 'Transferencia Bancaria'
    }
    if(data.crypto_transfer != 0){
        return 'Transferencia de criptomoneda'
    }
    if(data.mp_transfer != 0){
        return 'Mercado Pago'
    }
    if(data.binance_transfer != 0){
        return 'Transferencia en binance'
    }
    
}

module.exports = {
    extractPayMethod
}