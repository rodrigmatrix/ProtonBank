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
                message: 'Erro no mysql. Verifique o servidor'
            })
            res.end()
        }
        else{
            // var string = JSON.stringify(rows)
            // console.log("strin "+ string)
            // var jsonrows = JSON.parse(string)
            // console.log("row "+ jsonrows[0])
            // console.log("o id "+jsonrows[0].id)
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




module.exports = auth