import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import logicPutzplan from './logicPutzplan.js';
import dbCon from './db/dbCon.js';
import { getWeekNumber } from './utils.js';
import cors from 'cors';
// const reminder = require('./reminder.js');
// const schedule = require('node-schedule');
// const fs = require('fs');
// require('dotenv').config();



// get current Week Number
let currentWeekNum = getWeekNumber(new Date())[1];
// Get the current directory using import.meta.url
const __dirname = path.dirname(new URL(import.meta.url).pathname)


// TODO: db muss alte Daten löschen oder noch Attribut Jahr bekommen
// TODO: db muss falls noch nicht vorhanden vllt. noch erstellt werden
//
// const db = new sqlite3.Database(path.join(__dirname, 'db', 'mydbLite.db'), (err) => {
//   if (err) {
//     console.error('Error connecting to SQLite database', err);
//   } else {
//     console.log('Connected to SQLite database.');
//   }
// });

// Create an Express app
const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors());


// FIXME:
// const weekPlan = logicPutzplan.constructWeekPlan(currentWeekNum);
// start Whats App Web for sending Reminders
// reminder.sendWeeklyReminders().catch(console.error);
// // start a job to update the reminder message for each week
// const job = schedule.scheduleJob('59 * * * *', function () {

//   console.log("jobbing");
//   const weekPlan = logicPutzplan.constructWeekPlan(currentWeekNum);

//   let msg =
//     `Putzplan für Kalenderwoche ${currentWeekNum}:%0a  Karol:      ${weekPlan[0].raumBez}%0a  Konstantin: ${weekPlan[1].raumBez}%0a  Joshua:     ${weekPlan[2].raumBez}`;
//   console.log(`Changing message to:\n\n${msg} `);

//   reminder.changeMessage(msg);
// });


// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files as middleware
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', function (req, res, next) {
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
});


/*
 * @param: weekNum: is the clientside current week Number  
 * Description: This route gets called, when the site is loaded
 * It sends a json response with an Object conatining all information, to fill out 
 * the Putzplan Table for 5 weeks with currentweek Number as the third
 * */
app.get("/:weekNum/render-table", (req, res) => {
  if (req.params.weekNum == undefined) {
    console.log("need a weekNum");
  }

  // receive req with client's curr Week Number
  let wn = parseInt(req.params.weekNum);
  let tableData = {};


  // use async function because of underlying async Database Queries
  async function updateTableData() {
    for (let i = wn - 2; i <= wn + 2; i++) {
      try {
        const weekPutzplan = await logicPutzplan.getPutzplanForWeekNum(i);
        tableData[i] = weekPutzplan;
      } catch (err) {
        console.log("Encountered Error in LogicPutzplan " + err);
      }
    }
    res.json(tableData);
  }
  updateTableData();
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
  .post(function (req, res) {
    // Query if data exists
    let sql = `
    UPDATE Reinigung SET Erledigt=? 
    WHERE MitName = ?
    AND RaumBez = ?
    AND Kalenderwoche = ?`;

    // get params for placeholders
    let params = Object.keys(req.body).map(function (k) { return req.body[k] });
    console.log(params)


    const db = dbCon.connectDB();

    db.run(sql, params, (err) => {
      if (err) {
        console.error(err);
      }
    });

    db.close();

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
  console.log(`Server is running on http://localhost:${port}`);
});


