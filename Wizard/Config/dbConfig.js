const mysql = require('mysql2');


db = mysql.createConnection({
    // host:'localhost',
    // user:'root',
    // password:'Mysql@0503',
    // database:'wizard'

    // cloud database
    host:'16.171.112.35',
   user:'wizard',
    password:'wizard@2025#',
    database:'wizard'

    // Production database
//     host:'localhost',
//    user:'wizard',
//     password:'wizard@2025#',
//     database:'wizard'
    
});

module.exports=db;
