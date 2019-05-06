const router = require('express').Router()
const conn = require('../connections/connection')

//ADD NEW MOVIE
router.post('/movies',async (req,res)=>{
    var sql = `INSERT INTO movies SET ?;`
    // {nama,tahun,deskripsi}
    var sql2 = `SELECT * FROM movies`
    var data = req.body

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err.sqlMessage) // Error pada post data

        conn.query(sql2, (err, result) => {
            if(err) return res.send(err) // Error pada select data

            res.send(result)
        })
    })
})

//EDIT MOVIE
router.patch('/movies/:movieId', (req, res) => { 
    const sql = `UPDATE movies SET ? WHERE id = ?`
    
    const data = [req.body, req.params.movieId]

    conn.query(sql, data, (err, result) => {
        if (err) return res.send(err.mess)

        res.send(result)
    })
})

//DELETE MOVIE
router.delete('/movies/delete', (req, res) => { 
    const sql = `DELETE FROM movies WHERE id = ?`
    const data = req.body.id

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

//VIEW ALL MOVIES
router.get('/movies/movieAll', (req, res) => { 
    const sql = `SELECT * FROM movies`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err.message) // Error pada query SQL

        const movies = result // Result berupa array of object

        if(!movies) return res.send("Movie not found") // Movie tidak ditemukan

        res.send({
            movies
        })
    })
})

module.exports = router