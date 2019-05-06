const express = require('express')
const catgRouter = require('./routers/catgRouter')
const movcatRouter = require('./routers/movcatRouter')
const moviesRouter = require('./routers/moviesRouter')


const app = express()
const port = 2020

app.get('/',(req,res)=>{
    res.send(`
            <h1>Ini Home Page</h1>
            <h3>API Running on port ${port}</h3>`
            )
})

app.use(express.json())
app.use(catgRouter)
app.use(movcatRouter)
app.use(moviesRouter)


app.listen(port, () => {
    console.log("Running at ", port);
})