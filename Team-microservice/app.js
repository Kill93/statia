var express =  require('express');
var app = express();
var mysql = require('mysql');
var cors = require('cors');

app.use(cors());

var port = process.env.PORT || 5000;

var pool = mysql.createPool({
    user     : 'bfbf26b860f82d',
    password : 'bb8328d7',
    host     : 'us-cdbr-iron-east-05.cleardb.net',
    database: 'ad_92b7970d9a2aa1d',
    port     : 3306
});

app.get('/teams', function(req, res, next) {

    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Origin", "http://statia.cfapps.io");
    // res.header("Access-Control-Allow-Origin", "http://localhost:8000");
    // res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    // res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");

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
        connection.query('SELECT * FROM team',
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

app.post('/getTeam', function(req, res, next) {

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
        let sql = "Select * FROM team WHERE user_id='"+obj.user_id +"'";

        pool.getConnection(function(err, connection) {

            connection.query(sql ,(err, rows) => {
                if (err) {
                    throw err;
                }

                if (rows!=null && rows.length>0) {
                        var obj = {
                            status: "success",
                            team_id: rows[0].team_id,
                            location: rows[0].location,
                            team_name: rows[0].team_name,
                            team_type: rows[0].team_type,
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

app.post('/createTeam', function(req, res, next) {

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
        let sql = 'INSERT INTO team (user_id, team_name, location, team_type)' +
            'VALUES(?, ?, ? ,? )';

        let sql2 = "Select * FROM team WHERE user_id='"+obj.userID +"' AND team_name='"+obj.teamName +"'";

        pool.getConnection(function (err, connection) {
            console.log("connection started")

                        connection.query(sql, [obj.userID, obj.teamName, obj.location, obj.teamType], (err, rows) => {
                            if (err) {
                                throw err;
                            }
                        });

                        connection.query(sql2 ,(err, rows) => {
                            if (err) {
                                throw err;
                            }

                            if (rows!=null && rows.length>0) {
                                var obj = {
                                    status: "success",
                                    team_id: rows[0].team_id,
                                }
                                res.send(obj);
                                console.log(obj)
                            }
                            else{
                                var obj2 = {
                                    status: "none"
                                }
                                res.send(obj2);
                                console.log(sql2 + obj2)

                            }
                        });
                        connection.release();
                        console.log("connection ended")
                    })
                })

});

app.post('/addPlayers', function(req, res, next) {

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
        console.log(obj.length);
        let sql = 'INSERT INTO players (team_id, user_id, player_firstName, player_lastName)' +
            'VALUES(?, ?, ? ,? )';

        pool.getConnection(function (err, connection) {
            console.log("connection started")
            var i
            for (i = 0; i < obj.length; i++) {

                connection.query(sql, [obj[i].teamID, obj[i].userID, obj[i].firstName, obj[i].lastName], (err, rows) => {
                    if (err) {
                        throw err;
                    }
                });
            }
            var obj2 = {
                status: "success",
            }
            res.send(obj2);
            console.log(obj2)
            connection.release();
            console.log("connection ended")
        })
    })

});


app.post('/getPlayers', function(req, res, next) {

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
        let sql = "Select * FROM players WHERE team_id='"+obj.team_id +"'";

        pool.getConnection(function(err, connection) {

            connection.query(sql + 'ORDER BY player_firstName',(err, rows) => {
                if (err) {
                    throw err;
                }

                if (rows!=null && rows.length>0) {
                    var i
                    var players = []
                    for (i = 0; i < rows.length; i++) {

                        var obj = {
                            status: "success",
                            player_id: rows[i].player_id,
                            user_id: rows[i].user_id,
                            player_firstName: rows[i].player_firstName,
                            player_lastName: rows[i].player_lastName,
                            team_id: rows[i].team_id,
                        }
                        players.push(obj)
                    }
                    res.send(players);
                    console.log('players found')
                }
                else{
                    var obj1 = {
                        status: "none"
                    }
                    res.send(obj1);
                    console.log('no players found')

                }
            });
            connection.release();
        })

    })

});

app.post('/editPlayerList', function(req, res, next) {

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
        var playerList = []

        pool.getConnection(function (err, connection) {
            console.log("connection started")
            var i

            for (i = 0; i < obj.length; i++) {

                let sql4 = "SELECT * from players WHERE team_id='" + obj[i].teamID + "' AND player_firstName ='" + obj[i].firstName + "' AND player_lastName ='" + obj[i].lastName + "'";

                let sql1 = 'INSERT INTO players (player_id, team_id, user_id, player_firstName, player_lastName)' +
                    'VALUES(?, ?, ?, ? ,? )';

                let sql2 = "UPDATE players SET player_firstName='" + obj[i].firstName + "', player_lastName='" + obj[i].lastName + "', user_id='" + obj[i].userID + "' WHERE player_id='" + obj[i].playerID + "'";

                if (obj[i].playerID == null) {

                    connection.query(sql1, [obj[i].playerID, obj[i].teamID, obj[i].userID, obj[i].firstName, obj[i].lastName], (err, rows) => {
                        console.log('Added')
                        if (err) {
                            throw err;
                        }
                    });

                    connection.query(sql4, (err, rows) => {
                        console.log('Added: ' + rows[0].player_id)
                        if (err) {
                            throw err;
                        }
                        playerList.push(rows[0].player_id)
                        console.log(playerList)
                    });
                }
                else {
                    playerList.push(obj[i].playerID)
                    connection.query(sql2, (err, rows) => {
                        console.log('updated')
                        if (err) {
                            throw err;
                        }
                    });
                }
            }

            function stateChange(newState) {
                setTimeout(function () {
                    if (newState == -1) {
                        let sql3 = "DELETE from players where player_id NOT IN (" + playerList + ") AND team_id = '" + obj[0].teamID + "'";

                        connection.query(sql3, (err, rows) => {
                            console.log('new LIST: ' + playerList)
                            console.log('deleted players not in list' + sql3)
                            if (err) {
                                throw err;
                            }
                        });
                    }
                }, 1000);
            }

            stateChange(-1)

            var obj2 = {
                status: "success",
            }
            res.send(obj2);
            connection.release();
            console.log("connection ended")
        })

    })
});

app.post('/getKPI_List', function(req, res, next) {

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
        console.log(obj)
        let sql = "Select * FROM KPI WHERE user_id IS NULL OR user_id='"+obj.user_id +"'";

        pool.getConnection(function(err, connection) {

            connection.query(sql ,(err, rows) => {
                if (err) {
                    throw err;
                }
                    var i
                    var KPI = []
                    for (i = 0; i < rows.length; i++) {

                        var obj = {
                            status: "success",
                            KPI_id: rows[i].kpi_id,
                            KPI_title: rows[i].kpi_title,
                            KPI_description: rows[i].kpi_description,
                            KPI_type: rows[i].kpi_type,
                        }
                        KPI.push(obj)
                    }

                    res.send(KPI);
            });
            connection.release();
        })

    })

});

app.post('/editKPIList', function(req, res, next) {

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
        var KPIList = []

        pool.getConnection(function (err, connection) {
            console.log("connection started")

            var i
            for (i = 0; i < obj.length; i++) {
                let sql1 = 'INSERT INTO KPI (kpi_id,kpi_title, kpi_description, kpi_type, user_id)' +
                    'VALUES(?, ?, ?, ? ,? )';

                let sql2 = "UPDATE KPI SET kpi_title='"+obj[i].KPI_title +"', kpi_description='"+obj[i].KPI_description +"', kpi_type='"+obj[i].KPI_type +"', user_id='"+obj[i].userID +"' WHERE kpi_id='"+obj[i].KPI_id +"'";

                let sql4 = "SELECT * from KPI WHERE user_id='" + obj[i].userID + "' AND kpi_title ='" + obj[i].KPI_title +"'";


                if (obj[i].KPI_id == null) {

                    connection.query(sql1, [obj[i].KPI_id, obj[i].KPI_title, obj[i].KPI_description, obj[i].KPI_type, obj[i].userID], (err, rows) => {
                        if (err) {
                            throw err;
                        }
                    });

                    connection.query(sql4, (err, rows) => {
                        console.log('Added: ' + rows[0].kpi_id)
                        if (err) {
                            throw err;
                        }
                        KPIList.push(rows[0].kpi_id)
                        console.log(KPIList)
                    });
                }
                else {
                    KPIList.push(obj[i].KPI_id)
                    connection.query(sql2 , (err, rows) => {
                        console.log('updated')
                        if (err) {
                            throw err;
                        }
                    });

                }
            }

            function stateChange(newState) {
                setTimeout(function () {
                    if (newState == -1) {
                        let sql3 = "DELETE from KPI where kpi_id NOT IN (" + KPIList + ") AND user_id = '" + obj[0].userID + "'";

                        connection.query(sql3, (err, rows) => {
                            console.log('new LIST: ' + KPIList)
                            console.log('deleted KPI not in list' + sql3)
                            if (err) {
                                throw err;
                            }
                        });
                    }
                }, 1000);
            }

            stateChange(-1)

            var obj2 = {
                status: "success",
            }
            res.send(obj2);
            console.log(obj2)
            connection.release();
            console.log("connection ended")
        })
    })

});


app.listen(port);