const dbCon = require('./db/dbCon.js');
const sqlite3 = require('sqlite3').verbose();

const rotateArrayRight = (arr, rotNum) => {
  let last;
  let cpArr = [...arr];
  for (let i = 0; i < rotNum; i++) {
    last = cpArr.pop();
    cpArr.unshift(last);
  }
  return cpArr;
};



// static information: 
const personen = ["Karol", "Konstantin", "Joshua"];
const roomsToCleanEvenWeek = ["Bäder", "", "Wohnzimmer"];
const roomsToCleanOddWeek = ["", "Küche", "Bäder"];







/*
 *         
 * @param wn :  Week number int
 * @return:  {Room-mate: name,  room: room-name, done: bool} : object
 * */
function constructWeekPlan(wn) {
  let roomsToClean;
  let plan = [];

  if (wn % 2 == 0) {
    roomsToClean = rotateArrayRight(roomsToCleanEvenWeek, (wn / 2) % roomsToCleanEvenWeek.length);
  } else {
    roomsToClean = rotateArrayRight(roomsToCleanOddWeek, (Math.floor(wn / 2)) % roomsToCleanOddWeek.length);
  }
  personen.forEach((person, index) => {
    plan.push({ mitName: person, raumBez: roomsToClean[index], erledigt: false });
  });
  return plan;
}



/*
 *
 * @param wn :  Week number int
 * @return: object [{"mitName":"","raumBez":"","erledigt":false},...,{"mitName":"","raumBez":"","erledigt":}]
 *
 */
const getPutzplanForWeekNum = async (wn) => {
  let cleaningPlan = constructWeekPlan(wn);
  /*
   * move through plan to check if assignments exist in db 
   * if exists: check "Erledigt"
   * else create new with Erledigt: false
   *
   *
   */
  // Hilfsfunktion für Datenbankabfrage

  const db = dbCon.connectDB();

  const checkOrCreateCleaning = (assignment) => {
    return new Promise((resolve, reject) => {
      if (assignment.raumBez === "") {
        resolve(); // Falls RaumBez leer ist, nichts tun
        return;
      }


      let sql = `
        SELECT MitName, RaumBez, Kalenderwoche, Erledigt FROM Reinigung 
        WHERE Kalenderwoche=?
          AND RaumBez=? 
          AND MitName=?`;

      db.get(sql, [wn, assignment.raumBez, assignment.mitName], (err, row) => {
        if (err) {
          reject("Error in db connectivity " + err);
        } else if (row == undefined) {
          console.log("Reinigung doesn't exist yet. Creating new");

          // Reinigung erstellen
          sql = `
            INSERT INTO Reinigung (MitName, RaumBez, Kalenderwoche, Erledigt)
            VALUES (?, ?, ?, FALSE)`;

          db.run(sql, [assignment.mitName, assignment.raumBez, wn], (insertErr) => {
            if (insertErr) reject(insertErr);
            resolve();
          });
        } else {
          assignment.erledigt = !!row.Erledigt
          resolve();
        }
      });
    });
  };

  // Schleife für die Reinigungspunkte
  for (let index = 0; index < cleaningPlan.length; index++) {
    const assignment = cleaningPlan[index];
    await checkOrCreateCleaning(assignment); // Warten, bis jede Datenbankoperation abgeschlossen ist
  }

  db.close();
  return cleaningPlan;
};


exports.getPutzplanForWeekNum = getPutzplanForWeekNum;



