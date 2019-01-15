const express = require('express')
const auth = express()
const mysql = require('mysql')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const md5 = require('js-md5');

auth.use(morgan('short'))
auth.use(bodyParser.json())

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'protonbank'
})

function generateToken(userID){
    let expirationDate = Math.floor(Date.now() /100) + 3
    var token = jwt.sign({
        exp: expirationDate,
        sub: userID}, `userID`)
    return token
}

auth.post('/login/admin', (req, res) =>{
    const queryUrl = "SELECT * FROM admin where username = ? AND password = ?"
    // send the password in hash
    console.log(req.body)
    connection.query(queryUrl,[req.body.username, req.body.password], (error, rows, fields) =>{
        if(error){
            console.log(error)
            res.json({ 
                status: 500,
                message: 'Erro no servidor. Verifique sua conexão com a internet'
            })
            res.end()
        }
        else{
            if(rows != ''){
                res.json({ 
                    status: 200,
                    message: 'Sucesso. Token gerado',
                    token: generateToken(rows[0].id)
                })
            }
            else{
                res.json({ 
                    status: 400,
                    message: 'Dados não encontrados'
                })
            }
            
        }
        
    })
})

auth.post('/login/user', (req, res) =>{
    const queryUrl = "SELECT * FROM users where account = ? AND password = ?"
    // send the password in hash
    console.log(req.body)
    connection.query(queryUrl,[req.body.account, req.body.password], (error, rows, fields) =>{
        if(error){
            console.log(error)
            res.json({ 
                status: 500,
                message: 'Erro no servidor. Verifique sua conexão com a internet'
            })
            res.end()
        }
        else{
            if(rows != ''){
                if(rows[0].error_password == 0){
                    res.json({ 
                        status: 400,
                        message: 'Sua conta se encontra bloqueada no momento. Entre em contato conosco para desbloquear sua conta.'
                    })
                }
                else{
                    res.json({ 
                        status: 200,
                        message: 'Token gerado com sucesso',
                        token: generateToken(rows[0].id)
                    })
                }
                
            }
            else{
                // TODO UPDATE USER PASSWORD ERROR
                res.json({
                    status: 400,
                    message: 'Dados não encontrados'
                })
            }
            
        }
        
    })
})




module.exports = auth