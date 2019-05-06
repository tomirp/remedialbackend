const router = require('express').Router()
const conn = require('../connections/connection')

//ADD NEW CATEGORIES
router.post('/categories',async (req,res)=>{
    var sql = `INSERT INTO categories SET ?;`
    // {nama}
    var sql2 = `SELECT * FROM categories`
    var data = req.body

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err.sqlMessage) // Error pada post data

        conn.query(sql2, (err, result) => {
            if(err) return res.send(err) // Error pada select data

            res.send(result)
        })
    })
})

//EDIT CATEGORIES
router.patch('/categories/:catgId', (req, res) => { 
    const sql = `UPDATE categories SET ? WHERE id = ?`
    
    const data = [req.body, req.params.catgId]

    conn.query(sql, data, (err, result) => {
        if (err) return res.send(err.mess)

        res.send(result)
    })
})

//DELETE CATEGORIES
router.delete('/categories/delete', (req, res) => { 
    const sql = `DELETE FROM categories WHERE id = ?`
    const data = req.body.id

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

//VIEW ALL CATEGORIES
router.get('/categories/catgAll', (req, res) => { 
    const sql = `SELECT * FROM categories`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err.message) // Error pada query SQL

        const categories = result // Result berupa array of object

        if(!categories) return res.send("Categories not found") // Categories tidak ditemukan

        res.send({
            categories
        })
    })
})


module.exports = router