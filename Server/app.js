const express = require('express')
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')

//short
//combined
app.use(morgan('short'))

app.listen(3000, () =>{
    console.log("Server loaded")
})


var userRoutes = require('./routes/user.js')
var adminRoutes = require('./routes/admin.js')

app.use(userRoutes)
app.use(adminRoutes)

