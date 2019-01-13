const express = require('express')
const user = express()
const mysql = require('mysql')
const morgan = require('morgan')
var bodyParser = require('body-parser')

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


user.post('/users_new', (req, res) =>{
    const name = req.body.name
    console.log(req.body)
    console.log("nome: "+name)
    const queryUrl = "INSERT INTO USERS (name) VALUES (?)"
    connection.query(queryUrl, [name], (error, result , fields) =>{
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