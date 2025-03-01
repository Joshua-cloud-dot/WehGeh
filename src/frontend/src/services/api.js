import axios from 'axios';

async function fetchTableData() {      
    const response = await axios.get("http://localhost:5000/9/render-table");
    return response.data; 
}


export default {
    fetchTableData: fetchTableData,
}