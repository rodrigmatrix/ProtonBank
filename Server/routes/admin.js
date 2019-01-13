const express = require('express')
const admin = express()
const mysql = require('mysql')

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

module.exports = admin