const express = require('express')
const admin = express()
const mysql = require('mysql')
const morgan = require('morgan')
var bodyParser = require('body-parser')


admin.use(morgan('short'))
admin.use(bodyParser.json())

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'protonbank'
})


//get admins method
admin.get("/admin", (req, res) =>{
    connection.query("SELECT * from admin", (error, rows, fields) =>{
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


//get admins by id method
admin.get("/admin/:id", (req, res) =>{
    const queryUrl = "SELECT * from admin where id = ?"
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



admin.post('/admin_new', (req, res) =>{
    const name = req.body.name
    console.log(req.body)
    console.log("nome: "+name)
    const queryUrl = "INSERT INTO ADMIN (name) VALUES (?)"
    connection.query(queryUrl, [name], (error, result , fields) =>{
        if(error){
            console.log(error)
            res.json({ 
                status: 400,
                message: 'Erro ao cadastrar administrador. Verifique os dados'
            })
        }
        else{
            res.json({ 
                status: 200,
                message: 'Administrador criado com sucesso!'
            })
        }
    })
})

module.exports = admin