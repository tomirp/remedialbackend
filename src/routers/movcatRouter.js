const router = require('express').Router()
const conn = require('../connections/connection')

//ADD NEW CONNECTION
router.post('/movcat/movieId/catgId',async (req,res)=>{
    var sql = `INSERT INTO movcat SET ?;`
    // {nama}
    var sql2 = `SELECT a.nama as nama_movie, c.nama as nama_category FROM movies a`
    var sql2 = sql2 + ` JOIN movcat b ON a.id = b.movie_id`
    var sql2 = sql2 + ` JOIN categories c ON c.id = b.category_id;`
    var data = req.body

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err.sqlMessage) // Error pada post data

        conn.query(sql2, (err, result) => {
            if(err) return res.send(err) // Error pada select data

            res.send(result)
        })
    })
})

//DELETE CONNECTION
router.delete('/movcat/delete', (req, res) => { 
    const sql = `DELETE FROM movcat WHERE id = ?`
    const data = req.body.id

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})


module.exports = router