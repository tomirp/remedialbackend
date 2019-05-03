const router = require('express').Router()
const bcrypt = require('bcryptjs')
const isEmail = require('validator/lib/isEmail')
const conn = require('../connection/connection')
const multer = require('multer')
const path = require('path') // Menentukan folder uploads
const fs = require('fs') // menghapus file gambar
const sendVerify = require('../emails/nodemailer')

const uploadDir = path.join(__dirname + '/../uploads' )

const storagE = multer.diskStorage({
    // Destination
    destination : function(req, file, cb) {
        cb(null, uploadDir)
    },
    // Filename
    filename : function(req, file, cb) {
        cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
    }
})

const upstore = multer ({
    storage: storagE,
    limits: {
        fileSize: 10000000 // Byte
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){ // will be error if the extension name is not one of these
            return cb(new Error('Please upload image file (jpg, jpeg, or png)')) 
        }

        cb(undefined, true)
    }
})

router.post('/upstore', upstore.single('avatar'), (req, res) => {
    const sql = `SELECT * FROM users WHERE username = ?`
    const sql2 = `UPDATE users SET avatar = '${req.file.filename}'`
    const data = req.body.uname

    conn.query(sql, data, (err, result) => {
        if (err) return res.send(err)

        conn.query(sql2, (err , result) => {
            if (err) return res.send(err)

            res.send({filename: req.file.filename})
        })
    })
})

router.post('/users', async (req, res) => { // CREATE USER
    var sql = `INSERT INTO users SET  ?` // Tanda tanya akan digantikan oleh variable data
    var sql2 = `SELECT * FROM users`
    var data = req.body // Object dari user {username, name, email, password}

    // validasi untuk email
    if(!isEmail(req.body.email)) return res.send("Email is not valid")
    // ubah password yang masuk dalam bentuk hash
    req.body.password = await bcrypt.hash(req.body.password, 8)

    conn.query(sql, data, (err, _result) => {
        if(err) return res.send(err.sqlMessage) // Error pada post data

        sendVerify(req.body.username, req.body.name, req.body.email)

        conn.query(sql2, (err, result) => {
            if(err) return res.send(err) // Error pada select data

            res.send(result)
        })
    })
})

//LOGIN USER
router.post('/users/login', (req, res) => { // LOGIN USER
    const {username, password} = req.body

    const sql = `SELECT * FROM users WHERE username = '${username}'`

    conn.query(sql, async (err, result) => {
        if(err) return res.send(err.message) // Error pada query SQL

        const user = result[0] // Result berupa array of object

        if(!user) return res.send("User not found") // User tidak ditemukan

        if(!user.verified) return res.send("Please, verify your email") // Belum verifikasi email

        const hash = await bcrypt.compare(password, user.password) // true / false

        if(!hash) return res.send("Wrong password") // Password salah

        res.send(user) // Kirim object user
    })
})

router.get('/verify', (req, res) => {
    const username = req.query.username
    const sql = `UPDATE users SET verified = true WHERE username = '${username}'`
    const sql2 = `SELECT * FROM users WHERE username = '${username}'`

    conn.query(sql, (err, _result) => {
        if(err) return res.send(err.sqlMessage)

        conn.query(sql2, (err, _result) => {
            if(err) return res.send(err.sqlMessage)

            res.send('<h1>Verifikasi berhasil</h1>')
        })
    })
})

//UPLOAD AVATAR
router.get('/upstore/:imgName', (req, res) =>{ //UPLOAD AVATAR
    const options = {
        root: uploadDir
    }
    var fileName = req.params.filename

    res.sendFile(fileName, options, (err) => {
        if(err) return console.log(err)

        console.log('Sent :'+ fileName);
        
    })
})


//UPDATE USERS
router.patch('/users/:userid', (req, res) => {
    const sql = `UPDATE users SET ? WHERE id= ?`
    const data = [req.body, req.params.userid]

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err.message)

        res.send(result)
    })
})


router.get('/upstore/:idphoto', (req, res) => {
    res.sendFile(uploadDir + '/' + req.params.idphoto)
})

// GET USER
router.get('/users', async(req, res)=> {
    const {username} = req.body
    var sql = `SELECT * FROM users WHERE username = '${username}'`

    conn.query(sql, (err, result)=> {
        if(err) return res.send(err)

        if(!result[0].avatar) return res.send({user: result[0]})
        return res.send({user:result[0], photo: `http://localhost:2010/upstore/${result[0].avatar}`})
    })
})

//DELETE AVATAR
router.delete('/upstore/:username', (req, res) => { //Menghapus avatar
    const sql = `SELECT * FROM users WHERE username = ?`
    const sql2 = `UPDATE users SET avatar = NULL WHERE username = ?`
    // const data = req.body.uname

    conn.query(sql, req.params.username, (err, result) => {
        if(err) {
            res.send(err)
        }
        console.log(result);
        fs.unlinkSync(`${uploadDir}/${result[0].avatar}`)  
        
        conn.query(sql2, req.params.username, (err, _result) => {
            if(err) return res.send(err)

            res.status(200).send('avatar has been deleted')
        })
    })
})

//DELETE USERS
router.delete('/users/delete', (req, res) => {
    const sql = `DELETE FROM users WHERE username ?`
    const data = req.body.username

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err.message)

        res.send(result)
    })
})

module.exports = router