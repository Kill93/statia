var express =  require('express');
var app = express();
var mysql = require('mysql');
var cors = require('cors');

app.use(cors());

var port = process.env.PORT || 4000;

var pool = mysql.createPool({
    user     : 'bfbf26b860f82d',
    password : 'bb8328d7',
    host     : 'us-cdbr-iron-east-05.cleardb.net',
    database: 'ad_92b7970d9a2aa1d',
    port     : 3306
});

app.post('/register', function(req, res, next) {

    var allowedOrigins = ['http://statia.cfapps.io', 'http://localhost:8000'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);

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

    var allowedOrigins = ['http://statia.cfapps.io', 'http://localhost:8000'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);

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

    var allowedOrigins = ['http://statia.cfapps.io', 'http://localhost:8000'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);

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

app.post('/getUser', function(req, res, next) {

    var allowedOrigins = ['http://statia.cfapps.io', 'http://localhost:8000'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);

    var body = '';
    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        "use strict";
        var obj = JSON.parse(body);
        let sql = "Select * FROM users WHERE user_id='"+obj.user_id +"'";

        pool.getConnection(function(err, connection) {

            connection.query(sql ,(err, rows) => {
                if (err) {
                    throw err;
                }

                if (rows!=null && rows.length>0) {
                    var obj = {
                        status: "success",
                        user_email: rows[0].user_email,
                        user_firstName: rows[0].user_firstName,
                        user_lastName: rows[0].user_lastName,
                        user_dob: rows[0].user_dob,
                    }
                    res.send(obj);
                }
                else{
                    var obj1 = {
                        status: "none"
                    }
                    res.send(obj1);

                }
            });
            connection.release();
        })

    })

});


app.listen(port);