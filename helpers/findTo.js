const searchAddress = (logs, address_1, address_2) => {
    let existe = false
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
    return existe
}

module.exports = {
    searchAddress
}