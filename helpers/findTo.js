const fetch = require("node-fetch");
var Web3 = require('web3');

const searchAddress = (logs, address_1, address_2) => {
    let existe = false
    if ( logs !== undefined) {
        logs.forEach( (log) => {
            log.topics.forEach( (address) => {
                if ( address.includes(address_1.toLowerCase()) ) {
                    existe = true
                }
                if ( address.includes(address_2.toLowerCase()) ) {
                    existe = true
                }
            })
        })
    }
    return existe
}

const detectPayment = async (hash) => {
    let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    const bscscan = await fetch (`https://api.bscscan.com/api?module=proxy&action=eth_getTransactionReceipt&txhash=${hash}&apikey=${process.env.API_KEY_Bsc}`, requestOptions)
    const polygon = await fetch (`https://api.polygonscan.com/api?module=proxy&action=eth_getTransactionReceipt&txhash=${hash}&apikey=${process.env.API_KEY_Ply}`, requestOptions)
    const ethereum = await fetch (`https://api.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=${hash}&apikey=${process.env.API_KEY_Eth}`, requestOptions)
    const bscscanData = await bscscan.json()
    const polygonData = await polygon.json()
    const ethereumData = await ethereum.json()
    var transactionCheck = ""
    if (!bscscanData.error  || !polygonData.error || !ethereumData.error) {
        if ( bscscanData.result ) {
            console.log("Binance");
            transactionCheck = bscscanData.result
            const dataAux = await checkTimeAndValue(account, hash, "bsc");
            transactionCheck.timeStamp = dataAux.timeStamp
            transactionCheck.value = dataAux.value
        }
        if ( polygonData.result ) {
            console.log("Polygon");
            transactionCheck = polygonData.result
            const dataAux = await checkTimeAndValue(account, hash, "bsc");
            transactionCheck.timeStamp = dataAux.timeStamp
            transactionCheck.value = dataAux.value
        }
        if ( ethereumData.result ) {
            console.log("Ethereum");
            transactionCheck = ethereumData.result
            const dataAux = await checkTimeAndValue(account, hash, "bsc");
            transactionCheck.timeStamp = dataAux.timeStamp
            transactionCheck.value = web3.utils.fromWei(dataAux.value.toString(), 'ether')
        }
    }
    return transactionCheck
}

const checkTimeAndValue = async (account, hash,  type) => {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    if ( type === "bsc") {
        const bscscan = await fetch (`https://api.bscscan.com/api?module=account&action=txlist&address=${account}&startblock=1&endblock=99999999&sort=asc&apikey=${process.env.API_KEY_Bsc}`, requestOptions)
        const bscscanData = await bscscan.json()
        const array = bscscanData.result
        const data = searchHash(array, hash)
    }
    if ( type === "poly") {
        const polygon = await fetch (`https://api.polygonscan.com/api?module=account&action=txlist&address=${account}&startblock=1&endblock=99999999&sort=asc&apikey=${process.env.API_KEY_Ply}`, requestOptions)
        const polygonData = await polygon.json()
        const array = polygonData.result
        const data = searchHash(array, hash)
    }
    if ( type === "eth") {
        const ethereum = await fetch (`https://api.etherscan.io/api?module=account&action=txlist&address=${account}&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.API_KEY_Eth}`, requestOptions)
        const ethereumData = await ethereum.json()
        const array = ethereumData.result
        const data = searchHash(array, hash)
    }
    return data
}

const searchHash = (transactions, hash) => {
    data = {}
    console.log("Buscando...")
    transactions.forEach( (transaction) => {
        if ( transaction.hash === hash ){
            data.timeStamp = transaction.timeStamp
            data.value = transaction.value
        }
    })
    return data
}

module.exports = {
    searchAddress,
    detectPayment,
    checkTimeAndValue
}