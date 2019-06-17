const express = require('express')
const karyawan = require('./routers/karyawan')
// const select = require 


const app = express()
const port = 2020

app.get('/',(req,res)=>{
    res.send(`
            <h1>Ini Home Page</h1>
            <h3>API Running on port ${port}</h3>`
            )
})

app.use(express.json())
app.use(karyawan)


app.listen(port, () => {
    console.log("Running at ", port);
})