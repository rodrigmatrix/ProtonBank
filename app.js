const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

//short
//combined
app.use(morgan('short'))
app.use(cors())

app.listen(3000, () =>{
    console.log("Server loaded")
})


const userRoute = require('./routes/user.js')
const adminRoute = require('./routes/admin.js')
const authRoute = require('./routes/auth.js')
const transactionRoute = require('./routes/transaction.js')
const PORT = process.env.PORT || 3003

app.listen(PORT, () =>{
    console.log("Server Running")
})

app.use(userRoute)
app.use(adminRoute)
app.use(authRoute)
app.use(transactionRoute)


