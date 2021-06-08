const { Sequelize } = require('sequelize');

const {DBHOST, DBUSER, DBNAME, DBPASSWORD} = process.env

const db = new Sequelize(DBNAME, DBUSER, DBPASSWORD, {
    host: DBHOST,
    dialect: 'mysql',
    loggin: true
})

module.exports={
    db
} 