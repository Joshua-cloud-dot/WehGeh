const { dir } = require('console');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const https = require('https');
const http = require('http');
const fs = require('fs');

// TODO: db muss alte Daten löschen

const db = new sqlite3.Database(path.join(__dirname, 'db', 'mydbLite.db'), (err) => {
  if (err) {
    console.error('Error connecting to SQLite database', err);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create an Express app
const app = express();
const port = 8443;


// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());


// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files as middleware
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', function(req, res, next) {
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
}); 





// example middleware chain
// app.get('/now', function(req, res, next) {
//   req.time = new Date().toString();
//   next();
// }, function(req, res) {
//   res.json({time: req.time});
// });


// example param
// app.get('/:word/echo', function(req,res) {
//   // console.log(req.params);
//   res.json({echo: req.params.word});
// });

// example with query
app.route('/Reinigung')
  .get(function(req,res) {
    console.log(req.query);
    if (req.query.MitName && req.query.RaumBez && req.query.Kalenderwoche) {
      db.serialize( () => {

        // Query if data exists
        let sql = `
          SELECT COUNT(*) as count FROM Reinigung 
          WHERE Kalenderwoche=?
            AND RaumBez=? 
            AND MitName=?`;

        db.get(sql, [ req.query.Kalenderwoche, req.query.RaumBez, req.query.MitName ], (err, row) => {
          if (err) {
            res.status(500).json({error: err.message});
          } else if (row.count === 0) {
            console.log("Reinigung doesn't exist yet. Creating new");
            
            // Reinigung doesn't exist so it will be created with False because this Request
            // can only happen with newly created Reinigungen from rendering
            sql = `
                INSERT INTO Reinigung (MitName, RaumBez, Kalenderwoche, Erledigt)
                VALUES (
                    ?,
                    ?,
                    ?,
                    FALSE
                  )`;

            db.run(sql, [req.query.MitName, req.query.RaumBez, req.query.Kalenderwoche])
            res.json(false);
          } else {
            sql = `
              SELECT Erledigt FROM Reinigung 
              WHERE Kalenderwoche=?
                AND RaumBez=? 
                AND MitName=?`;

            db.get(sql, [ req.query.Kalenderwoche, req.query.RaumBez, req.query.MitName ], (err, row) => {
              if (err) {
                res.status(500).json({error: err.message});
              } else {
                console.log(row);
                res.json(row);
              }
            });
          }
        });
      });
    } else {
      res.sendStatus(404);
    }
  })
  .post(function(req, res) {
    // Query if data exists
    let sql = `
    UPDATE Reinigung SET Erledigt=? 
    WHERE MitName = ?
    AND RaumBez = ?
    AND Kalenderwoche = ?`;

    // get params for placeholders
    let params = Object.keys(req.body).map(function(k){return req.body[k]});
    console.log(params)

    db.run(sql, params, (err) => {
      if (err) {
        console.error(err);
      }
    });


    res.send("Data received: " + JSON.stringify(req.body));
  });




// example json
// app.get("/json", function(req, res) {
//   console.log("received get request for /json");
//   // res.sendFile(path.join(__dirname, './server.js'));
//   // process.env.MESSAGE_STYLE
//   res.json({"message": process.env.MESSAGE_STYLE});
// })

// Start the server
 app.listen(port, () => {
 console.log(`Server is running on http://wehgeh.local:${port}`);
 });



//const options = {
//  key: fs.readFileSync('key.pem'),
//  cert: fs.readFileSync('cert.pem')
//};

//http.createServer(options, app).listen(port, () => {
//  console.log('HTTPS server running on port ' + port);
//});
