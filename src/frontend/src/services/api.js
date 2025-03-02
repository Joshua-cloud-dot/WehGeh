import axios from 'axios';


const apiAddr = "http://localhost:5000";

// Reinigung Table component
//---------------------------
async function fetchTableData() {      
    const response = await axios.get(apiAddr + "/9/render-table");
    return response.data; 
}
// Handle cleaning updates 
const changeReinigungStatus = (mitName, wn, raumBez, erledigt) => {
  fetch(apiAddr + `/Reinigung`, {
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













export default {
    fetchTableData: fetchTableData,
    changeReinigungStatus: changeReinigungStatus,
}