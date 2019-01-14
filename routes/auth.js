const express = require('express')
const auth = express()
const mysql = require('mysql')
const morgan = require('morgan')
const bodyParser = require('body-parser')

auth.use(morgan('short'))
auth.use(bodyParser.json())

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'protonbank'
})






module.exports = auth