const express = require('express')
const app = express()
const morgan = require('morgan')

//short
//combined
app.use(morgan('short'))

app.listen(3000, () =>{
    console.log("Server loaded")
})

app.get("/admin", (req, res) =>{
    var user = {
        name: "rodrigo",
        username: "rodrigmatrix"
    }
    res.json(user)
})
