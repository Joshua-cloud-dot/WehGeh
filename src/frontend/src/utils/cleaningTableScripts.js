/* 
 * Script for the Weh Geh Putzplan Web-App
 * its purpose is to render and update the Putzplan (table)
 * via API requests
 *
 *
 *
 * */


const weekNumberSpan = document.getElementById("calendar-week");
const firstTableRow = document.getElementById("tab-head-row");
const table = document.getElementById("table");


const redColor = "bg-red-950";
const greenColor = "bg-green-900";




// const reinigungErledigt = async (mitName, wn, raumBez) => {
//   try {
//     const response = await fetch(`/Reinigung?MitName=${mitName}&Kalenderwoche=${wn}&RaumBez=${raumBez}`);
//     if (!response.ok) {
//       throw new Error(`Error: ${response.statusText}`);
//     }
//     const data = await response.json();
//     return data;  // Return the JSON data from the API
//   } catch (err) {
//     console.error('Error fetching data:', err);
//     return null;  // Return null in case of error
//   }
// };


// Handle cleaning updates 
const changeReinigungStatus = (mitName, wn, raumBez) => {
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
    body: JSON.stringify({ Erledigt: erledigt, MitName: mitName, RaumBez: raumBez, Kalenderwoche: wn })
  })
    .then(response => response)
    .then(json => {
      console.log(json);
    })
    .catch(error => console.error('Error:', error));
};



/*
 * render Table from gathered Data on week nums
 */
const fillTable = async (currentWeekNum) => {


  let tableStr = `<tbody class= "bg-slate-700 text-slate-400" > `;
  const tableData = await fetchTableRenderData(currentWeekNum);

  // for each week generate one table row 
  for (const weekNum in tableData) {
    const weekPlan = tableData[weekNum];
    console.log(weekPlan);

    let rowStr = `
      <tr>
      <td
      class="td-week-number ${weekNum == currentWeekNum ? 'text-3xl"' : "text-sm"} ">${weekNum}</td>`;

    // add rooms to table as per the cleaning assignment
    weekPlan.forEach(cleaning => {
      if (cleaning.raumBez == "") {
        rowStr += `<td class="break">-</td>`;
      } else
        // render divs with classes based on the erledigt status of the cleaning
        rowStr += `
          <td>
            <div id="${cleaning.mitName}-${weekNum}-${cleaning.raumBez}" class="text-sm font-thin ${cleaning.erledigt === true ? greenColor : redColor} button" onclick="changeReinigungStatus('${cleaning.mitName}', ${weekNum}, '${cleaning.raumBez}')">
              ${cleaning.raumBez}
            </div>
          </td>`;
    });
    rowStr += `</tr>`;
    tableStr += rowStr;
  }
  tableStr += `</tbody>`;
  table.innerHTML += tableStr;
};