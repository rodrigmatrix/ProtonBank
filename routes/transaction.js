const express = require('express')
const transaction = express()
const mysql = require('mysql')
const morgan = require('morgan')
const bodyParser = require('body-parser')

transaction.use(morgan('short'))
transaction.use(bodyParser.json())

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'protonbank'
})

module.exports = transaction
