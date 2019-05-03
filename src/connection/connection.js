const mysql = require('mysql')

const conn = mysql.createConnection({
    user: 'tommyrp',
    password: 'leviathan27',
    host: 'db4free.net',
    database: 'tommydatabase',
    port: '3306'
})

module.exports = conn