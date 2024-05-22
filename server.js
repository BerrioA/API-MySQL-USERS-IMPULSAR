const express = require('express')
const mysql = require('mysql')
const myconn = require('express-myconnection')

const routes = require('./routes')

const app = express()
app.set('port', process.env.PORT || 9000)
const dbOptions = {
    host: 'b87j0ttgbimt1yoh1uzm-mysql.services.clever-cloud.com',
    port: 3306,
    user: 'uqumyc5ht2wkpfe3',
    password: 'TWeDJNZfuD6j75Zpbu3j',
    database: 'b87j0ttgbimt1yoh1uzm'
}

// middlewares -------------------------------------
app.use(myconn(mysql, dbOptions, 'single'))
app.use(express.json())

// routes -------------------------------------------
app.get('/', (req, res)=>{
    res.send('Welcome to my API')
})
app.use('/api/usuarios', routes)

// server running -----------------------------------
app.listen(app.get('port'), ()=>{
    console.log('Servidor corriendo en el puerto', app.get('port'))
})