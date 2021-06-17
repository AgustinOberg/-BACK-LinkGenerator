const extractPayMethod = (data) => {
    if(data.bank_transfer != -1){
        return 'Transferencia Bancaria'
    }
    if(data.crypto_transfer != -1){
        return 'Transferencia de criptomoneda'
    }
    if(data.mp_transfer != -1){
        return 'Mercado Pago'
    }
    
}

module.exports = {
    extractPayMethod
}