/*this module handles Database connectivity*/

const sqlite3 = require('sqlite3').verbose();
const path = require('path');




function connectDB() {
  const db = new sqlite3.Database(path.join(__dirname, 'mydbLite.db'), (err) => {
    if (err) {
      console.error('Error connecting to SQLite database', err);
    } 
  });

  return db;
}

exports.connectDB = connectDB;

