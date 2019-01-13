const express = require('express')
const user = express()
const mysql = require('mysql')


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'protonbank'
})

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
module.exports = user