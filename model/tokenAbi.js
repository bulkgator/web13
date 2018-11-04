const mysql = require("mysql");


const db = mysql.createConnection({
    host    : "localhost",
    user    : "root",
    password: "",
    database: "test"
});

db.connect(function(err){
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to database test")
    }
});


exports.getAbi = function(symbol, callback){
    let sql = `SELECT id, symbol FROM abi WHERE symbol = ?`;
    db.query(sql, [symbol], function(err, data){
        if(err){
            callback(err);
        }else{
            callback(null, data);
        }
    })
}