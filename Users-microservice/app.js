var express =  require('express');
var app = express();
var mysql = require('mysql');
var cors = require('cors');

app.use(cors());

var port = process.env.PORT || 4000;

var pool = mysql.createPool({
    user     : 'bd968bfd137990',
    password : 'ed6c5842',
    host     : 'us-cdbr-iron-east-05.cleardb.net',
    database: 'ad_89c00011e2ad773',
    port     : 3306
});

app.post('/register', function(req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    var body = '';
    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        "use strict";
        var obj = JSON.parse(body);
        console.log(obj);
        let sql = 'INSERT INTO users (user_role, user_email, user_password, user_firstName, user_lastName, user_dob)' +
            'VALUES(?, ?, ? ,? ,?, ?)';

        var query = "SELECT * FROM Users where user_email='" + obj.email + "'";

        pool.getConnection(function (err, connection) {
            console.log("connection started")

            connection.query(
                query,
                [],
                function (err, rows) {
                    if (err) {
                        res.end("error");
                        throw err;
                    }
                    if (rows != null && rows.length > 0) {
                        console.log(" user already in database");
                        var obj1 = {
                            status: "dupe"
                        }
                        res.send(obj1);
                        console.log(obj1)
                    }
                    else {
                        connection.query(sql, [obj.role, obj.email, obj.password, obj.firstName, obj.lastName, obj.dob], (err, rows) => {
                            if (err) {
                                throw err;
                            }
                        });
                        var obj2 = {
                            status: "success"
                        }
                        res.send(obj2);
                        console.log(obj2)
                    }
                    connection.release();
                    console.log("connection ended")

                })
        })
    })

});

app.post('/login', function(req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    var body = '';
    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        "use strict";
        var obj = JSON.parse(body);
        console.log(obj);
        let sql = "Select * FROM users WHERE user_email='"+obj.email + "' AND user_password='"+obj.password +"'";

        pool.getConnection(function(err, connection) {

            connection.query(sql ,(err, rows) => {
                if (err) {
                    throw err;
                }

                if (rows!=null && rows.length>0) {
                    require('crypto').randomBytes(48, function(err, buffer) {
                        var token = buffer.toString('hex');
                        console.log(token)
                        console.log(" user in database" );
                        var obj = {
                            id: rows[0].user_id,
                            firstName: rows[0].user_firstName,
                            role: rows[0].user_role,
                            success: "success",
                            token: token
                        }
                        console.log(obj)
                        res.send(obj);
                    });

                }
                else{
                    console.log(" user not in database");
                    var obj1 = {
                        status: "invalid"
                    }
                    res.send(obj1);

                }
            });
            connection.release();
        })

    })

});

app.get('/users', function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");

    pool.getConnection(function(err, connection) {
        console.log("connection started")
        connection.query('SELECT * FROM users',
            function (err, results, fields) {
                if (err) {
                    throw err;
                }
                res.send(results);

            });
        connection.release();
        console.log("connection ended")
    })
});


app.listen(port);