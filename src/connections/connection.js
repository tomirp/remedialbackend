const mysql = require('mysql')

const conn = mysql.createConnection({
    user: 'root',
    password: 'Mysql123',
    host: '127.0.0.1',
    database:'remedialbackend',
    port: '3306'
})

module.exports = conn
