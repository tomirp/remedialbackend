const router = require('express').Router()
const conn = require('../connections/connection')

//INSERT KARYAWAN
router.post('/tambahkrywn',async (req,res)=>{
    var sql = `INSERT INTO karyawan SET ?;`
    var sql2 = `SELECT * FROM karyawan`
    var data = req.body

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err.sqlMessage) 

        conn.query(sql2, (err, result) => {
            if(err) return res.send(err) 

            res.send(result)
        })
    })
})

//SELECT KARYAWAN
router.get('/karyawan/allkaryawan', (req, res) => { 
    const sql = `SELECT * FROM karyawan`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err.sqlMessage)
        const slctkrywn = result 

        if(!slctkrywn) return res.send(err) 

        res.send({
            slctkrywn
        })
    })
})


//EDIT KARYAWAN
router.patch('/karyawan/:Id', (req, res) => { 
    const sql = `UPDATE karyawan SET ? WHERE id = ?`
    const data = [req.body, req.params.Id]

    conn.query(sql, data, (err, result) => {
        if (err) return res.send(err.mess)

        res.send(result)
    })
})

//DELETE KARYAWAN
router.delete('/karyawan/delete', (req, res) => { 
    const sql = `DELETE FROM karyawan WHERE id = ?`
    const data = req.body.id

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})


module.exports = router