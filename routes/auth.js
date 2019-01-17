const express = require('express')
const auth = express()
const mysql = require('mysql')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

auth.use(morgan('short'))
auth.use(bodyParser.json())

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'protonbank'
})

function generateToken(userID,name){
    let expirationDate = Math.floor(Date.now() /100) + 3
    var token = jwt.sign({
        exp: expirationDate,
        name: name,   
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
    const queryUrl = "SELECT * FROM users where account = ?"
    connection.query(queryUrl,[req.body.account], (error, rows, fields) =>{
        if(error){
            console.log(error)
            res.json({
                status: 500,
                message: 'Erro no servidor. Verifique sua conexão com a internet'
            })
            res.end()
        }
        else{
            //console.log(rows)
            if(rows == ''){
                res.json({ 
                    status: 500,
                    message: 'Conta não encontrada'
                })
            }
            else{
                const queryUrl = "SELECT * FROM users where id = ? AND password = ?"
                connection.query(queryUrl,[rows[0].id,req.body.password], (error2, rows2, fields2) =>{
                if(error2){
                    res.json({ 
                        status: 500,
                        message: 'Erro no servidor. Verifique sua conexão com a internet'
                    })
                }
                else{
                    if(rows2 != ''){
                        if(rows2[0].error_password == 0){
                            res.json({
                                status: 400,
                                message: 'Sua conta se encontra bloqueada no momento. Entre em contato conosco para desbloquear sua conta.'
                            })
                        }
                        else{
                            updateErrorPassword(rows[0].id,3)
                            res.json({ 
                                status: 200,
                                message: 'Token gerado com sucesso',
                                token: generateToken(rows2[0].id,rows2[0],name)
                            })
                        }
                    }
                    else{
                        updateErrorPassword(rows[0].id,rows[0].error_password)
                        res.json({
                            status: 400,
                            message: 'Senha Incorreta.'
                        })
                    }
                }
                })
            }
            
            
        }
    })
})


function updateErrorPassword(userID,wrong){
    var queryUrl = "UPDATE users SET error_password = ? where id = ?"
    connection.query(queryUrl,[wrong-1,userID], (error,result,fields) =>{
        if(error){
            console.log(error)
            console.log("Update error")
        }
    })
}

module.exports = auth