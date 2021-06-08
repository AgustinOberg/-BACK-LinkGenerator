const express = require('express')
const cors = require('cors')
const { db } = require('../db/connection')

class Server {

    constructor(){
        this.app = express()
        this.port = process.env.PORT
        this.dbConection()
        this.middlewares()
        this.routes()
        
    }


    middlewares(){

        this.app.use( cors() )
        this.app.use( express.json() )
    }

    routes(){
        this.app.use( '/api/url', require('../routes/url') )
        this.app.use( '/api/pay', require('../routes/pay') )
    }

    async dbConection(){
        try {
            await db.authenticate();
            console.log("Database Online")
        } catch (error) {
            throw new Error(error)
        }
    }


    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Servidor corriendo en el puerto ',this.port)
        })
    }

}

module.exports = Server