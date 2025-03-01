<script>
  import { getWeekNumber } from '@/utils/weeks';
  import api from '@/services/api.js'

  


  export default {
    data() {
      return {
        tableData: null,
        redColor: "bg-red-950",
        greenColor: "bg-green-900",
        currentWeekNum: getWeekNumber(new Date())[1],
        loading: true,


      };
    },
    async created() {
      try {
        this.tableData = await api.fetchTableData();
        
        // Set loading to false when data is ready

        this.loading = false;
      } catch (error) {
        console.error("Error fetching data:", error);
        this.loading = false; // In case of an error, stop loading
      }
    },
    methods: {
      changeReinigungStatus(one, to, three) {
        console.log("to be implemented");
      }
    }
  };
</script>

<template>
  <div class="table-wrapper centered" style="overflow-x:auto;">
    <table class="table-auto border-collapse border border-gray-400 bg-slate-900" id="table">
      <caption>
        Aktuelle Kalenderwoche: <span id="calendar-week">{{ currentWeekNum }}</span><br>
      </caption>
      <thead>
        <tr class=" text-xl" id="tab-head-row" >
          <th class="border border-gray-400 ">KW</th>
          <th class="border border-gray-400 ">Karol</th>
          <th class="border border-gray-400 ">Konstantin</th>
          <th class="border border-gray-400 ">Joshua</th>
        </tr>
      </thead>
      <div v-if="loading" class="text-xl text-center w-full"  >Loading...</div>
      <tbody v-else class= "bg-slate-700 text-slate-400" >

        <tr v-for="(weekPlan, weekNum) in tableData">
          <td class="td-week-number" :class="weekNum == currentWeekNum ? 'text-3xl':'text-sm'" >{{ weekNum }}</td>
          <td v-for="(cleaning) in weekPlan">
            <div v-if="(cleaning.raumBez != '')" :id="cleaning.mitName + '-'+ weekNum + '-' + cleaning.raumBez" class="text-sm font-thin button" :class="!!cleaning.erledigt ? greenColor : redColor"  @:click="changeReinigungStatus( cleaning.mitName, weekNum, cleaning.raumBez)">
              {{ cleaning.raumBez }}
            </div>
            <span v-else class="break">-</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>


#idiot-btn {
  border: 1px solid red;

}

#idiot-btn:hover {
 background-color: gray; 
}

</style>