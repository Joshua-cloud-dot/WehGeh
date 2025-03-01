/*this module handles Database connectivity*/

import sqlite3 from 'sqlite3';
import path from 'path';


const __dirname = path.dirname(new URL(import.meta.url).pathname)


function connectDB() {
  const db = new sqlite3.Database(path.join(__dirname, 'mydbLite.db'), (err) => {
    if (err) {
      console.error('Error connecting to SQLite database', err);
    } 
  });

  return db;
}

export default {
  connectDB: connectDB,
}
