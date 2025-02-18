// const { response } = require("express");
const weekNumberSpan = document.getElementById("calendar-week");
const firstTableRow = document.getElementById("tab-head-row");
const table = document.getElementById("table");


const bewohner = ["Karol", "Konstantin", "Joshua"];
const redColor = "bg-red-950";
const greenColor = "bg-green-900";

// TODO via API
const roomsToCleanEvenWeek = [ "Bäder", "", "Wohnzimmer"];
const roomsToCleanOddWeek = [ "", "Küche", "Bäder"];

// alte version mit 3 zu 1
// const roomsToCleanEvenWeek = [ "Bäder", "", ""];
// const roomsToCleanOddWeek = [ "Wohnzimmer", "Küche", "Bäder"];

// util functions
function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
  // Return array of year and week number
  return [d.getUTCFullYear(), weekNo];
}

const rotateArrayRight = (arr, rotNum) => {
  let last;
  let cpArr = [...arr];
  for (let i = 0; i < rotNum; i++) {
    last = cpArr.pop();
    cpArr.unshift(last);
  }
  return cpArr;
};

const assignment = (rooms, weekNum) => {
  return (rotateArrayRight(rooms, (weekNum) % rooms.length));
};



const reinigungErledigt = async (mitName, wn, raumBez) => {
  try {
    const response = await fetch(`/Reinigung?MitName=${mitName}&Kalenderwoche=${wn}&RaumBez=${raumBez}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;  // Return the JSON data from the API
  } catch (err) {
    console.error('Error fetching data:', err);
    return null;  // Return null in case of error
  }
};


const changeReinigungStatus = (mitName, wn, raumBez) =>  {
  const tdEl = document.getElementById(`${mitName}-${wn}-${raumBez}`);
  let erledigt;
  if (tdEl.classList.contains(greenColor)) {
    tdEl.classList.replace(greenColor, redColor);
    erledigt = false;
  } else {
    tdEl.classList.replace(redColor, greenColor);
    erledigt = true;
  }

  fetch(`/Reinigung`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ Erledigt: erledigt, MitName: mitName, RaumBez: raumBez, Kalenderwoche: wn})
  })
  .then(response => response)
  .then(json => {
    console.log(json);
  })
  .catch(error => console.error('Error:', error));
};



let currentWeekNum = getWeekNumber(new Date())[1];
// let currentWeekNum = 30;






const fillTable = async (weekNum) => {
  let start = weekNum - 2;
  let arr;
  
  let tableStr = `<tbody class="bg-slate-700 text-slate-400">`;
  for (let i = start; i <= weekNum + 2; i++) {
    
    if (i % 2 == 0) {
      arr = assignment(roomsToCleanEvenWeek, i / 2);
    } else {
      arr = assignment(roomsToCleanOddWeek, Math.floor(i / 2));
    }

    let rowStr = `
      <tr>
        <td 
          class="td-week-number ${i === weekNum ? 'text-3xl"': "text-sm"} ">${i}</td>`;

    // render one row
    let a = await Promise.all(arr.map(async (assigned, index) => { 
      if (assigned == "") {
        return `<td class="break">-</td>`;
      } else {
        // Call reinigungErledigt and await the result
        const done = await reinigungErledigt(bewohner[index], i, assigned);
        console.log(done ); // Check if 'done' is now populated

        // render divs with classes based on the result
        return `
          <td>
            <div id="${bewohner[index]}-${i}-${assigned}" class="text-sm font-thin ${done.Erledigt === 1 ? greenColor : redColor} button" onclick="changeReinigungStatus('${bewohner[index]}', ${i}, '${assigned}')">
              ${assigned}  <!-- Example: Show status -->
            </div>
          </td>`;
      }
    }));

    rowStr += a.join("");

    rowStr += `</tr>`;
    tableStr += rowStr;
  }
  tableStr += `</tbody>`;
  table.innerHTML += tableStr;
};




// render index.html
weekNumberSpan.innerText = currentWeekNum;

fillTable(currentWeekNum);


// let wn = 5;
// let raumBez = 'Bäder';
// let mitName = 'Karol';

// fetch(`/Reinigung?MitName=${mitName}&Kalenderwoche=${wn}&RaumBez=${raumBez}`)
//   .then(response => response.json())
//   .then(data => {
//     console.log(data);
//   })
//   .catch(err => {
//     console.error('Error fetching data:', err);
//   })





