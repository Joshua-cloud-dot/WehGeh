const sqlite3 = require('sqlite3').verbose();
const path = require('path');



const db = new sqlite3.Database(path.join(__dirname, 'mydbLite.db'), (err) => {
  if (err) {
    console.error('Error connecting to SQLite database', err);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// testquery
exports.testQuery = function () {
  db.all("SELECT * FROM Mitbewohner", (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      rows.forEach(row => console.log(row))
    }
  });
}


exports.getRooms = function () {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM Raum", (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);  // Reject the promise if there is an error
      } else {
        resolve(rows);  // Resolve the promise with the result
      }
    });
  });
}



