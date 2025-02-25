/*this module handles Database connectivity*/

const sqlite3 = require('sqlite3').verbose();
const path = require('path');




function connectDB() {
  console.log("Hi from db");
  console.log(path.join(__dirname), 'mydbLite.db');

  const db = new sqlite3.Database(path.join(__dirname, 'mydbLite.db'), (err) => {
    if (err) {
      console.error('Error connecting to SQLite database', err);
    } else {
      console.log('Connected to SQLite database. From dbCon');
    }
  });


  return db;
}

exports.connectDB = connectDB;

