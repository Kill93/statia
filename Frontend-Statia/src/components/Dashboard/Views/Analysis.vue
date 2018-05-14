<template>
  <div class="analysis">

    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card>
            <template slot="header">
              <h4 class="card-title">Matches</h4>
            </template>

            <select class="form-control"  v-model="kpiData" @change="getStats">
              <option id="null"></option>
              <option v-for="row in KPITitles" :value="row.kpi_id" >{{ row.title }}</option>
            </select>
            <br>
            <div class="Chart">
              <canvas ref="canvas" id="chart" width="100%" height="50%"></canvas>
            </div>

            <br>
            <table class="table">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Opposition</th>
                <th scope="col">Date</th>
                <th scope="col">Competition</th>

              </tr>
              </thead>
              <tbody>
              <tr v-for="matches in matchesComplete">
                <td class="match"><input type="checkbox" checked="checked" v-model="checkedMatches" :value='matches.match_id' @change="assignMatches"></td>
                <td class = "match">{{ matches.opposition_name }}</td>
                <td class = "match">{{ date1(matches.match_date) }}</td>
                <td class = "match">{{ matches.match_competition }}</td>
              </tr>
              </tbody>
            </table>
          </card>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
  import LineExample from '../../../Charts/chart-data'
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import axios from "axios";
  import {Line} from 'vue-chartjs'
  import moment from 'moment'

  export default {
    props: ['role', 'user', 'userID','selectedMatch','teamID', 'players', 'KPI_list' ,'teamExist','location','matchesDue', 'matchesComplete', 'team_name', 'team_type', 'awayTeams'],
      name: 'app',
      extends: Line,
      components: {
        LineExample,
        Card
      },
    data() {
      return {
        kpiData: '',
        labels: [],
        labels2:[],
        checkedMatches: [],
        matchesTitle:[],
        checkedData:[],
        KPITitles:[],
        allStats: [],
        specificStats:[
          {
            "title": "Choose a KPI"
          }
        ],
        specValues:[],
        options: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              boxWidth: 80,
              fontColor: 'black'
            }
          },
          scales: {
            xAxes: [{
              gridLines: {
                display: false,
                color: "black"
              },
              scaleLabel: {
                display: true,
                labelString: "Time in Seconds",
                fontColor: "red"
              }
            }],
            yAxes: [{
              gridLines: {
                color: "black",
                borderDash: [2, 5],
              },
              scaleLabel: {
                display: true,
                labelString: "Speed in Miles per Hour",
                fontColor: "green"
              }
            }]
          }
        }
      }
    },
    mounted () {
      this.getCollected()
      this.render()
      this.$emit('updateMatches', '1');
    },
    methods: {
      date1(date2) {
        return moment(String(date2)).format('DD-MMM-YY')
      },
      render() {
        var ctx = document.getElementById("chart").getContext('2d');
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: this.labels2,
            datasets: [{
              label: this.specificStats[0].title,
              data: this.specValues,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero:true,
                  stepSize: 1
                }
              }]
            }
          }
        });
      },
      assignMatches() {
        this.labels = []
        this.labels2 = []
        for (var i = 0; i < this.checkedMatches.length; i++) {
          var obj = {
            "id": this.checkedMatches[i],
            "opposition": '',
            "date": ''
          }
          this.labels.push(obj)
        }
        this.getStats()
      },
      getCollected() {
        var teamUser = {
          "team_id": this.teamID,
        }
        axios({
          url: 'https://matches-microservice.cfapps.io/getAllKPIs',
          method: 'post',
          contentType: 'application/json',
          data: teamUser,
        }).then(result => {


          if (result.data.length != '0') {
            var collectedKPI = []
            var homeKPI = []
            var awayKPI = []
            var i
            var x

            for (i = 0; i < result.data.length; i++) {

              var KPI = {
                "kpi_id": result.data[i].kpi_id,
                "title": '',
                "collected_id": result.data[i].collected_id,
                "matchEvent_id": result.data[i].matchEvent_id,
                "collected_pitch_location": result.data[i].collected_pitch_location,
                "collected_time": result.data[i].collected_time,
                "team_id": result.data[i].team_id,
                "player_number": result.data[i].player_number,
                "player_name": '',
                "team_name": '',
                "quantity": 0
              }
              collectedKPI.push(KPI)
            }

            console.log('this.getCollected1')
            var uniqueArray = []
            this.allStats = collectedKPI
            uniqueArray = this.removeDuplicates(collectedKPI, 'kpi_id')
            this.KPITitles = uniqueArray
            this.assignTitles()
          }
        }).catch(error => {
          console.log(error);
        });
      },
      removeDuplicates(originalArray, prop) {
        var newArray = [];
        var lookupObject = {};

        for (var i in originalArray) {
          lookupObject[originalArray[i][prop]] = originalArray[i];
        }

        for (i in lookupObject) {
          newArray.push(lookupObject[i]);
        }
        return newArray;
      },
      assignTitles() {
        axios({
          url: 'https://matches-microservice.cfapps.io/getAllTitles',
          method: 'post',
          contentType: 'application/json',
        }).then(result => {

          if (result.data.length != '0') {
            var titles = []
            var i
            var x

            for (i = 0; i < result.data.length; i++) {

              var KPI = {
                "kpi_id": result.data[i].kpi_id,
                "kpi_title": result.data[i].kpi_title,
              }
              titles.push(KPI)
            }

            var x
            var i
            var n
            for (x = 0; x < this.KPITitles.length; x++) {
              for (i = 0; i < titles.length; i++) {
                if (this.KPITitles[x].kpi_id == titles[i].kpi_id) {
                  this.KPITitles[x].title = titles[i].kpi_title
                }
              }
            }
          }
        }).catch(error => {
          console.log(error);
        });
      },
      getStats() {
        this.specificStats = []
        var stats = []
        for (var v = 0; v < this.checkedMatches.length; v++) {
            for (var i = 0; i < this.allStats.length; i++) {
              if (this.kpiData != 'pointsR') {
                if (this.kpiData == this.allStats[i].kpi_id && this.allStats[i].matchEvent_id == this.checkedMatches[v]) {
                  var KPI = {
                    "kpi_id": this.allStats[i].kpi_id,
                    "title": '',
                    "matchEvent_id": this.allStats[i].matchEvent_id,
                    "quantity": 0
                  }
                  stats.push(KPI)
                }
              }
              if (this.kpiData == 'pointsR' && this.allStats[i].matchEvent_id == this.checkedMatches[v]) {
                var KPI = {
                  "kpi_id": 999,
                  "title": 'Points Conversion Ratio',
                  "matchEvent_id": this.allStats[i].matchEvent_id,
                  "quantity": 0
                }
                stats.push(KPI)
              }
            }
        }
        console.log('stats pushed')
        this.loopHome(stats)
      },
      getR(stats){
        console.log('hi')
        var pointAttempts = 0
        var points = 0
          for (var i = 0; i < stats.length; i++) {
            if (stats[i].title == 'Points Conversion Ratio') {
              for (var n = 0; n < this.allStats.length; n++) {
              if (this.allStats[n].matchEvent_id == stats[i].matchEvent_id) {
                if (this.allStats[n].kpi_id == 4 || this.allStats[n].kpi_id == 8 || this.allStats[n].kpi_id == 6 || this.allStats[n].kpi_id == 11) {
                  pointAttempts++
                }
                if (this.allStats[n].kpi_id == 4 || this.allStats[n].kpi_id == 6) {
                  points++
                }
                stats[i].quantity = pointAttempts/points
              }
            }
          }
        }

        var uniqueArrayZ = this.removeDuplicates(stats, "matchEvent_id");
        this.specificStats = uniqueArrayZ
        console.log(this.specificStats.length)
        this.specStats()
      },
      loopHome(stats) {
        var i
        var x
        for (x = 0; x < this.allStats.length; x++) {
          for (i = 0; i < stats.length; i++) {
            if (this.allStats[x].kpi_id == stats[i].kpi_id && stats[i].matchEvent_id == this.allStats[x].matchEvent_id) {
              stats[i].quantity++
            }
          }
        }
        this.getR(stats)

        console.log(stats)
        console.log('statsLoop')

        // for (x = 0; x < stats.length; x++) {
        //   for (i = 0; i < stats.length; i++) {
        //     if (stats[x].kpi_id == stats[i].kpi_id && stats[x].quantity > stats[i].quantity) {
        //       stats.splice(i, 1);
        //     }
        //   }
        // }
      },
      specStats() {
        this.specValues = []
        for (var x = 0; x < this.specificStats.length; x++) {
          for (var i = 0; i < this.KPITitles.length; i++) {
            if (this.specificStats[x].kpi_id == this.KPITitles[i].kpi_id ) {
              this.specificStats[x].title = this.KPITitles[i].title
              this.specValues.push(this.specificStats[x].quantity)
            }
            if ( this.specificStats[x].kpi_id == 999){
              this.specificStats[x].title = 'Points Conversion Ratio'
              this.specValues.push(this.specificStats[x].quantity)
            }
          }
        }
        this.assignTeamNames()
      },
      removeDuplicates(originalArray, prop) {
        var newArray = [];
        var lookupObject = {};

        for (var i in originalArray) {
          lookupObject[originalArray[i][prop]] = originalArray[i];
        }

        for (i in lookupObject) {
          newArray.push(lookupObject[i]);
        }
        return newArray;
      },
      assignTeamNames() {
        for (var x = 0; x < this.labels.length; x++) {
          for (var n = 0; n < this.matchesComplete.length; n++) {
            if (this.labels[x].id == this.matchesComplete[n].match_id) {
              this.labels[x].opposition = this.matchesComplete[n].opposition_name
              this.labels[x].date= this.date1(this.matchesComplete[n].match_date)
            }
          }
        }

        this.labels.sort(function(a,b){
          var c = new Date(a.date);
          var d = new Date(b.date);
          return c-d;
        });

        for (var x = 0; x < this.labels.length; x++) {
          this.labels2[x] =this.labels[x].opposition + ':' + this.labels[x].date
        }
        console.log('hi')
        console.log(this.labels)
        this.render()
      },
      getRatios () {
        var pointAttempts=0
        var points=0
        var goalAttempts=0
        var goals=0

        for (var x = 0; x < this.homeCollected.length; x++) {
          if (this.homeCollected[x].kpi_id == 4 || this.homeCollected[x].kpi_id == 8 || this.homeCollected[x].kpi_id == 6 || this.homeCollected[x].kpi_id == 11) {
            pointAttempts += this.homeCollected[x].quantity
          }
          if (this.homeCollected[x].kpi_id == 5 || this.homeCollected[x].kpi_id == 7 || this.homeCollected[x].kpi_id == 9 || this.homeCollected[x].kpi_id == 10) {
            goalAttempts += this.homeCollected[x].quantity
            console.log(this.homeCollected[x])
          }
        }

        for (var x = 0; x < this.collected.length; x++) {
          if(this.collected[x].team_id == this.teamID)
            if (this.collected[x].kpi_id==4 || this.collected[x].kpi_id==6){
              points++
            }
          if (this.collected[x].kpi_id==5 || this.collected[x].kpi_id==7){
            goals++
          }
        }

        this.PointRatios = pointAttempts/points
        console.log(pointAttempts)
        this.GoalRatios = goalAttempts/goals
      }
    },
  }
</script>
<style is scoped>

  .Chart {
    border-radius: 15px;
    background-color: white;
    box-shadow: 0px 2px 15px rgba(25, 25, 25, 0.27);
    width: 80%;
    height: 80%;
    margin:auto;
  }

  .Chart h2 {
    margin-top: 0;
    padding: 15px 0;
    color:  rgba(255, 0,0, 0.5);
    border-bottom: 1px solid #323d54;
  }

  .checkBox {
    width: 15%;
    float:left;
  }

  /* The container */
  .container {
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 1em;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* Hide the browser's default checkbox */
  .container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  /* On mouse-over, add a grey background color */
  .container:hover input ~ .checkmark {
    background-color: #ccc;
  }

  /* When the checkbox is checked, add a blue background */
  .container input:checked ~ .checkmark {
    background-color: #2196F3;
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  .container input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the checkmark/indicator */
  .container .checkmark:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }

  h4 {
    margin:auto;
  }

  select {
    font-size: 1em;
    width: 30%;
    margin: auto;
    text-align: center;
  }

  thead {
    background-color: #17252A;
    color: #40a0e0;
  }

  table {
    width: 80%;
    margin: auto;
  }

</style>
