const express = require('express')
const user = express()
const mysql = require('mysql')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const md5 = require('js-md5');
const generator = require('creditcard-generator')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'protonbank'
})

user.use(morgan('short'))
user.use(bodyParser.json())

//get user method
user.get("/api/users", (req, res) =>{
    if(req.body.token == null){
        res.json({
            status: 405,
            message: 'Não autorizado'
        })
    }
    else{
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
    }
    
})

//get user by id method
user.get("/api/users/:id", (req, res) =>{
    const queryUrl = "SELECT * from users where id = ?"
    if(req.body.token == null){
        res.json({
            status: 405,
            message: 'Não autorizado'
        })
    }
    else{
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
    }
    
})

function generateAccountNumber(){
    return (Math.floor(Math.random()*10).toString()+Math.floor(Math.random()*10).toString()+Math.floor(Math.random()*10).toString()+Math.floor(Math.random()*10).toString()
    +Math.floor(Math.random()*10).toString()+"-"+Math.floor(Math.random()*10).toString())
}

user.post('/api/user_new', (req, res) =>{
    var cardNumber
    switch(req.body.card_brand){
        case "Mastercard":
        cardNumber = generator.GenCC("Mastercard", 1)

        case "Visa":
        cardNumber = generator.GenCC("VISA", 1)
    }

    var date = new Date()
    var month = date.getMonth() + 1
    var monthString
    var year = date.getFullYear() + 5

    if(month <= 9 ){
        monthString = "0" + month
    }
    else{
        monthString = month
    }

    let user = {
        name: req.body.name,
        address: req.body.address,
        birth_date: req.body.birth_date,
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
        password: req.body.password,
        account: generateAccountNumber(),
        account_plan: req.body.account_plan,
        debit_card_number: cardNumber,
        debit_card_expire: monthString + "/" + year,
        debit_card_cvv: Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString(),
        debit_card_flag: req.body.card_brand
    }
    //duplicate cpf
    const findCpf = "SELECT * from users where cpf = ?"
    connection.query(findCpf, user.cpf, (error, rows, fields) =>{
        if(error){
            res.json({
                status: 400
            })
        }
        else{
            if(rows != ''){
                res.json({
                    status: 404,
                    message: 'Este cliente já tem cadastro'
                })
                return
            }
        }
    })

    const queryUrl = "INSERT INTO USERS (name,address,birth_date,adress_neighborhood,adress_number,info_address,zip,email,city,job,state,country,"+
    "phone,cpf,password,account,account_plan,debit_card_number,debit_card_expire,debit_card_cvv,debit_card_flag)" + 
    " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
    connection.query(queryUrl, [
        user.name,
        user.address,
        user.birth_date,
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
        user.account_plan,
        user.debit_card_number,
        user.debit_card_expire,
        user.debit_card_cvv,
        user.debit_card_flag
    ], (error, result , fields) =>{
        if(error){
            console.log(error)
            res.json({ 
                status: 400,
                message: 'Erro ao cadastrar cliente. Verifique se todos os campos foram preenchidos.'
            })
        }
        else{
            res.json({ 
                status: 200,
                message: 'Cliente cadastrado com sucesso!',
                name: user.name,
                account: user.account,
                account_plan: user.account_plan
            })
        }
    })
})




module.exports = user