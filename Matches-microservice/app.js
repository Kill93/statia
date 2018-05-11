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

app.post('/matches', function(req, res, next) {

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

    let sql = "SELECT * FROM matchevent WHERE teamHome_id='"+obj.team_id +"'";

    pool.getConnection(function(err, connection) {
        console.log("connection started")

        connection.query(sql + 'ORDER BY dateMatch' ,(err, rows) => {
            if (err) {
                throw err;
            }

            if (rows!=null && rows.length>0) {

                var matches = []
                var i
                for (i = 0; i < rows.length; i++) {
                    var obj = {
                        status: "success",
                        match_id: rows[i].match_id,
                        teamHome_id: rows[i].teamHome_id,
                        teamAway_id: rows[i].teamAway_id,
                        matchDaySquad_id: rows[i].matchDaySquad_id,
                        competition: rows[i].competition,
                        match_status: rows[i].match_status,
                        dateMatch: rows[i].dateMatch,
                        location: rows[i].location,
                        opposition: rows[i].oppositionName,
                    }
                    matches.push(obj)
                }
                res.send(matches);
                console.log(matches)
            }
            else{
                var obj1 = {
                    status: "none"
                }
                res.send(obj1);
                console.log(obj1)

            }
        });
        connection.release();
        console.log("connection ended")
        })
    })
});

app.post('/createMatch', function(req, res, next) {

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
        let sql = 'INSERT INTO matchevent (teamHome_id, teamAway_id, matchDaySquad_id, competition, match_status, dateMatch, location, oppositionName)' +
            'VALUES(?,?,?,?,?,?,?,? )';

        pool.getConnection(function (err, connection) {
            console.log("connection started")

            connection.query(sql, [obj.teamHome_id, obj.teamAway_id, obj.matchDaySquad_id, obj.competition, obj.match_status,obj.dateMatch, obj.location, obj.teamAway_name], (err, rows) => {
                if (err) {
                    throw err;
                }
            });
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

app.post('/getAwayTeam', function(req, res, next) {

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
        let sql = "Select * FROM team WHERE team_type = 'away' AND user_id='"+obj.userID +"'";

        pool.getConnection(function(err, connection) {

            connection.query(sql ,(err, rows) => {
                if (err) {
                    throw err;
                }

                if (rows!=null && rows.length>0) {
                    var i
                    var teams = []
                    for (i = 0; i < rows.length; i++) {

                        var obj = {
                            status: "success",
                            away_id: rows[i].team_id,
                            away_name: rows[i].team_name
                        }
                        teams.push(obj)
                    }
                    res.send(teams);
                    console.log('Away Teams found')
                }
                else{
                    var obj1 = {
                        status: "none"
                    }
                    res.send(obj1);
                    console.log('no away Teams found')

                }
            });
            connection.release();
        })

    })

});

app.post('/getMatch', function(req, res, next) {

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

        let sql = "SELECT * FROM matchevent WHERE match_id='"+obj.match_id +"'";

        pool.getConnection(function(err, connection) {
            console.log("connection started")

            connection.query(sql ,(err, rows) => {
                if (err) {
                    throw err;
                }

                if (rows!=null && rows.length>0) {

                    var match = []
                        var obj = {
                            status: "success",
                            match_id: rows[0].match_id,
                            teamHome_id: rows[0].teamHome_id,
                            teamAway_id: rows[0].teamAway_id,
                            matchDaySquad_id: rows[0].matchDaySquad_id,
                            competition: rows[0].competition,
                            match_status: rows[0].match_status,
                            dateMatch: rows[0].dateMatch,
                            location: rows[0].location,
                            opposition: rows[0].oppositionName,
                        }
                        match.push(obj)
                    res.send(match);
                    console.log(match)
                }
                else{
                    var obj1 = {
                        status: "none"
                    }
                    res.send(obj1);
                    console.log(obj1)

                }
            });
            connection.release();
            console.log("connection ended")
        })
    })
});

app.post('/getCollected', function(req, res, next) {

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

        let sql = "SELECT * FROM collected_kpi WHERE matchEvent_id='"+obj.match_id +"'";

        pool.getConnection(function(err, connection) {
            console.log("connection started")

            connection.query(sql + 'ORDER BY kpi_id' , (err, rows) => {
                if (err) {
                    throw err;
                }

                if (rows!=null && rows.length>0) {

                    var collected = []
                    var i
                    for (i = 0; i < rows.length; i++) {
                        var obj = {
                            status: "success",
                            collected_id: rows[i].collected_id,
                            matchEvent_id: rows[i].matchEvent_id,
                            kpi_id: rows[i].kpi_id,
                            collected_pitch_location: rows[i].collected_pitch_location,
                            collected_time: rows[i].collected_time,
                            team_id: rows[i].team_id,
                            player_number: rows[i].player_number,
                            player_id: rows[i].player_id,
                        }
                        collected.push(obj)
                    }
                    res.send(collected);
                    console.log(collected)
                }
                else{
                    var obj1 = {
                        status: "none"
                    }
                    res.send(obj1);
                    console.log(obj1)

                }
            });
            connection.release();
            console.log("connection ended")
        })
    })
});

app.post('/getKPIname', function(req, res, next) {

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

        let sql = "SELECT * FROM kpi WHERE kpi_id='"+obj.kpi_id +"'";

        pool.getConnection(function(err, connection) {
            console.log("connection started")

            connection.query(sql ,(err, rows) => {
                if (err) {
                    throw err;
                }

                if (rows!=null && rows.length>0) {

                    var kpi = []
                        var obj = {
                            status: "success",
                            kpi_id: rows[0].kpi_id,
                            kpi_title: rows[0].kpi_title,
                    }
                    kpi.push(obj)
                    res.send(kpi);
                    console.log('GOT KPI NAME' + kpi)
                }
                else{
                    var obj1 = {
                        status: "none"
                    }
                    res.send(obj1);
                    console.log(obj1)

                }
            });
            connection.release();
            console.log("connection ended")
        })
    })
});

app.post('/editMatchDetails', function(req, res, next) {

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

        pool.getConnection(function (err, connection) {
            console.log("connection started")

            var i
            for (i = 0; i < obj.length; i++) {

                let sql2 = "UPDATE matchevent SET competition='"+obj[i].match_competition +"', match_status='"+obj[i].match_status +"', dateMatch='"+obj[i].match_date +"', location='"+obj[i].match_location +"' WHERE match_id='"+obj[i].match_id +"'";

                    connection.query(sql2, (err, rows) => {
                        console.log('UPDATED MATCHEVENT')
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

app.post('/createMatchdaySquad', function(req, res, next) {

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
        let sql = 'INSERT INTO matchdaySquad (matchevent_id)' +
            'VALUES(?)';
        let sql2 = "SELECT * FROM matchdaySquad WHERE matchevent_id='"+obj.matchevent_id +"'";

        let sql3 = "UPDATE matchevent SET match_status='Ready' WHERE match_id='" + obj.matchevent_id + "'";

        pool.getConnection(function (err, connection) {
            console.log("connection started")

            connection.query(sql, [obj.matchevent_id], (err, rows) => {
                if (err) {
                    throw err;
                }
            });

            connection.query(sql3, (err, rows) => {
                if (err) {
                    throw err;
                }
            });

            connection.query(sql2, (err, rows) => {
                if (err) {
                    throw err;
                }
                var obj2 = {
                    status: "success",
                    matchdaySquad_id: rows[0].squad_id
                }
                let sql4 = "UPDATE matchevent SET matchDaySquad_id='" + rows[0].squad_id + "' WHERE match_id='" + obj.matchevent_id + "'";

                connection.query(sql4, (err, rows) => {
                    if (err) {
                        throw err;
                    }
                });

            res.send(obj2);
            console.log(obj2)
            connection.release();
            console.log("connection ended")
            });
        })
    })
});

app.post('/createSquadMember', function(req, res, next) {

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
        let sql = 'INSERT INTO squadmember (position, squad_number, squad_id, player_id, player_name)' +
            'VALUES(?, ?, ?, ?,?)';

        pool.getConnection(function (err, connection) {
            console.log("connection started")
            var i
            for (i = 0; i < obj.length; i++) {

                connection.query(sql, [obj[i].position, obj[i].squadNumber, obj[i].squadID, obj[i].playerID, obj[i].name ], (err, rows) => {
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

app.post('/saveMatchKPIs', function(req, res, next) {

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
        let sql = 'INSERT INTO matchkpi (match_id, kpi_id, kpi_title)' +
            'VALUES(?, ?, ?)';

        pool.getConnection(function (err, connection) {
            console.log("connection started")
            var i
            for (i = 0; i < obj.length; i++) {

                connection.query(sql, [obj[i].match_id, obj[i].KPI_id, obj[i].KPI_title ], (err, rows) => {
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

app.post('/getMatchKPIs', function(req, res, next) {

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

        let sql = "SELECT * FROM matchkpi WHERE match_id='"+obj.match_id +"'";

        pool.getConnection(function(err, connection) {
            console.log("connection started")

            connection.query(sql + 'ORDER BY kpi_id' ,(err, rows) => {
                if (err) {
                    throw err;
                }

                if (rows!=null && rows.length>0) {

                    var kpis = []
                    var i
                    for (i = 0; i < rows.length; i++) {
                        var obj = {
                            status: "success",
                            kpi_id: rows[i].kpi_id,
                            kpi_title: rows[i].kpi_title,
                        }
                        kpis.push(obj)
                    }
                    res.send(kpis);
                    console.log(kpis)
                }
                else{
                    var obj1 = {
                        status: "none"
                    }
                    res.send(obj1);
                    console.log(obj1)

                }
            });
            connection.release();
            console.log("connection ended getting match kpi's")
        })
    })
});

app.post('/getSquadMembers', function(req, res, next) {

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

        let sql = "SELECT * FROM matchdaySquad WHERE matchevent_id='"+obj.matchevent_id +"'";

        pool.getConnection(function(err, connection) {
            console.log("connection started")

            connection.query(sql, (err, rows) => {
                if (err) {
                    throw err;
                }
                var obj2 = {
                    status: "success",
                    squad_id: rows[0].squad_id
                }
                let sql2 = "SELECT * FROM squadmember WHERE squad_id='"+rows[0].squad_id +"'";

                connection.query(sql2, (err, rows) => {
                    if (err) {
                        throw err;
                    }

                    if (rows!=null && rows.length>0) {

                        var collected = []
                        var i
                        for (i = 0; i < rows.length; i++) {
                            var obj = {
                                status: "success",
                                position: rows[i].position,
                                squad_number: rows[i].squad_number,
                                player_id: rows[i].player_id,
                                player_name: rows[i].player_name,
                            }
                            collected.push(obj)
                        }
                        res.send(collected);
                        console.log(collected)
                    }
                        else {
                            var obj = {
                                status: "none",
                            }
                        res.send(obj2);
                        console.log(obj2)
                        }
                });
                connection.release();
                console.log("connection ended")
            });
        })
    })
});

app.post('/finishMatch', function(req, res, next) {

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
        let sql = 'INSERT INTO collected_kpi (matchEvent_id, kpi_id, collected_pitch_location, collected_time, team_id, player_number, player_id)' +
            'VALUES(?,?,?,?,?,?,?)';
        let sql3 = "UPDATE matchevent SET match_status='complete' WHERE match_id='" + obj[0].matchEvent_id + "'";

        pool.getConnection(function (err, connection) {
            console.log("connection started")
            var i
            for (i = 0; i < obj.length; i++) {

                connection.query(sql, [obj[i].matchEvent_id, obj[i].kpi_id, obj[i].collected_pitch_location, obj[i].collected_time,obj[i].team_id,obj[i].player_number, obj[i].player_id], (err, rows) => {
                    if (err) {
                        throw err;
                    }
                });
            }

            connection.query(sql3, (err, rows) => {
                if (err) {
                    throw err;
                }
            });

            var obj2 = {
                status: "success",
            }
            res.send(obj2);
            console.log(obj2)
            connection.release();
            console.log("connection ended finishing match")
        })
    })


});

app.post('/getAllKPIs', function(req, res, next) {

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

        let sql = "SELECT * FROM collected_kpi WHERE team_id='"+obj.team_id +"'";

        pool.getConnection(function(err, connection) {
            console.log("connection started")

            connection.query(sql + 'ORDER BY kpi_id' ,(err, rows) => {
                if (err) {
                    throw err;
                }

                if (rows!=null && rows.length>0) {

                    var collected = []
                    var i
                    for (i = 0; i < rows.length; i++) {
                        var obj = {
                            status: "success",
                            collected_id: rows[i].collected_id,
                            matchEvent_id: rows[i].matchEvent_id,
                            kpi_id: rows[i].kpi_id,
                            collected_pitch_location: rows[i].collected_pitch_location,
                            collected_time: rows[i].collected_time,
                            team_id: rows[i].team_id,
                            player_number: rows[i].player_number,
                            player_id: rows[i].player_id,
                        }
                        collected.push(obj)
                    }
                    res.send(collected);
                    console.log(collected)
                }
                else{
                    var obj1 = {
                        status: "none"
                    }
                    res.send(obj1);
                    console.log(obj1)

                }
            });
            connection.release();
            console.log("connection ended getting match kpi's")
        })
    })
});

app.post('/getAllTitles', function(req, res, next) {

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

        let sql = "SELECT * FROM kpi ORDER BY kpi_id";

        pool.getConnection(function(err, connection) {
            console.log("connection started")

            connection.query(sql ,(err, rows) => {
                if (err) {
                    throw err;
                }

                if (rows!=null && rows.length>0) {

                    var collected = []
                    var i
                    for (i = 0; i < rows.length; i++) {
                        var obj = {
                            status: "success",
                            kpi_id: rows[i].kpi_id,
                            kpi_title: rows[i].kpi_title,
                        }
                        collected.push(obj)
                    }
                    res.send(collected);
                    console.log(collected)
                }
                else{
                    var obj1 = {
                        status: "none"
                    }
                    res.send(obj1);
                    console.log(obj1)

                }
            });
            connection.release();
            console.log("connection ended getting all titles kpi's")
        })
    })
});



app.listen(port);