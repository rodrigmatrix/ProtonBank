const express = require('express')
const user = express()
const mysql = require('mysql')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const md5 = require('js-md5');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'protonbank'
})

user.use(morgan('short'))
user.use(bodyParser.json())

//get user method
user.get("/users", (req, res) =>{

    connection.query("SELECT * from users", (error, rows, fields) =>{
        if(error){
            console.log(error)
            res.sendStatus(500)
            res.end()
        }
        else{
            res.json(rows)
        }
        
    })
})

//get user by id method
user.get("/users/:id", (req, res) =>{
    const queryUrl = "SELECT * from users where id = ?"
    connection.query(queryUrl,[req.params.id], (error, rows, fields) =>{
        if(error){
            console.log(error)
            res.sendStatus(500)
            res.end()
        }
        else{
            res.json(rows)
        }
        
    })
})

user.post('/user_new', (req, res) =>{
    const user = {
        name: req.body.name,
        address: req.body.address,
        adress_neighborhood: req.body.adress_neighborhood,
        address_number: req.body.address_number,
        info_address: req.body.info_address,
        zip: req.body.zip,
        email: req.body.email,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        phone: req.body.phone,
        cpf: req.body.cpf,
        job: req.body.job,
        password: md5(req.body.password),
        account: 0001,
        debit_card_number: req.body.debit_card_number,
        debit_card_expire: req.body.debit_card_expire,
        debit_card_cvv: req.body.debit_card_cvv,
        debit_card_flag: req.body.debit_card_flag
    }
    console.log(req.body)
    const queryUrl = "INSERT INTO USERS (name,address,adress_neighborhood,adress_number,info_address,zip,email,city,job,state,country,"+
    "phone,cpf,password,account,debit_card_number,debit_card_expire,debit_card_cvv,debit_card_flag)" + 
    " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
    connection.query(queryUrl, [
        user.name,
        user.address,
        user.adress_neighborhood,
        user.address_number,
        user.info_address,
        user.zip,
        user.email,
        user.city,
        user.job,
        user.state,
        user.country,
        user.phone,
        user.cpf,
        user.password,
        user.account,
        user.debit_card_number,
        user.debit_card_expire,
        user.debit_card_cvv,
        user.debit_card_flag
    ], (error, result , fields) =>{
        if(error){
            console.log(error)
            res.json({ 
                status: 400,
                message: 'Erro ao cadastrar cliente. Verifique os dados'
            })
        }
        else{
            res.json({ 
                status: 200,
                message: 'Cliente cadastrado com sucesso!'
            })
        }
    })
})


module.exports = user