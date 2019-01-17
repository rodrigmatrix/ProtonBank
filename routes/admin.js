const express = require('express')
const admin = express()
const mysql = require('mysql')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const md5 = require('js-md5');

admin.use(morgan('short'))
admin.use(bodyParser.json())

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'protonbank'
})


//get users method
admin.get("/api/admin", (req, res) =>{
    // verify token
    if(req.body.token == null){
        res.json({
            status: 405,
            message: 'Não autorizado'
        })
    }
    else{
        connection.query("SELECT * from ADMIN", (error, rows, fields) =>{
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


//get users by id method
admin.get("/api/admin/:id", (req, res) =>{
    // verify token
    if(req.body.token == null){
        res.json({
            status: 405,
            message: 'Não autorizado'
        })
    }
    else{
        const queryUrl = "SELECT * from user where id = ?"
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



admin.post('/api/admin_new', (req, res) =>{
    const user = {
        name: req.body.name,
        address: req.body.address,
        adress_neighborhood: req.body.adress_neighborhood,
        address_number: req.body.address_number,
        address_info: req.body.address_info,
        zip: req.body.zip,
        email: req.body.email,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        phone: req.body.phone,
        cpf: req.body.cpf,
        role: req.body.role,
        username: req.body.username,
        password: md5(req.body.password),
    }
    const queryUrl = "INSERT INTO ADMIN (name,address,address_neighborhood,address_number,address_info,zip,state,city,country,"+
    "phone,cpf,username,email,password,role)" + 
    " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
    connection.query(queryUrl, [
        user.name,
        user.address,
        user.adress_neighborhood,
        user.address_number,
        user.address_info,
        user.zip,
        user.state,
        user.city,
        user.country,
        user.phone,
        user.cpf,
        user.username,
        user.email,
        user.password,
        user.role
    ], (error, result , fields) =>{
        if(error){
            console.log(error)
            res.json({ 
                status: 400,
                message: 'Erro ao cadastrar funcionário. Verifique os dados'
            })
        }
        else{
            res.json({ 
                status: 200,
                message: 'Funcionário cadastrado com sucesso!'
            })
        }
    })
})

module.exports = admin