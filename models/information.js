const Sequelize = require('sequelize');
const { db } = require('../db/connection');

const Information = db.define('informations',{
    url:{
        type: Sequelize.STRING
    },
    bank_transfer:{
        type: Sequelize.TINYINT
    },
    crypto_transfer:{
        type: Sequelize.TINYINT
    },
    mp_transfer:{
        type: Sequelize.TINYINT
    },
    status:{
        type: Sequelize.NUMBER
    },
    amount:{
        type: Sequelize.DOUBLE
    },
    duration:{
        type: Sequelize.NUMBER
    },
    email:{
        type: Sequelize.STRING
    }
})

module.exports={
    Information
}