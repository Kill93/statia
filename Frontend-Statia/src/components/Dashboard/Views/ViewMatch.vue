<template>
  <div class="viewMatch">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">

          <card>
            <template slot="header">

              <table class="table">
                <tbody v-for="m in match">
                <tr>
                  <th scope="col">Opposition</th>
                  <td class = "match">{{ m.opposition_name }}</td>
                </tr>
                <tr>
                  <th scope="col">Competition</th>
                  <td class = "match">{{ m.match_competition }}</td>
                </tr>
                <tr>
                  <th scope="col">Date</th>
                  <td class = "match">{{ m.match_date }}</td>
                </tr>
                <tr>
                  <th scope="col">Location</th>
                  <td class = "match">{{ m.match_location }}</td>
                </tr>
                <tr>
                  <th scope="col">Status</th>
                  <td class = "match">{{ m.match_status }}</td>
                </tr>
                </tbody>
              </table>
              <button class="btn btn-warning" @click.prevent="relocate_editMatch">Edit Match Details<i class="glyphicon glyphicon-edit"></i></button>
            </template>
              <vue-tabs>
                <v-tab title="Upcoming" v-if="match[0].match_status == 'complete'">
                  <div class="container-stats" >
                    <div class = "stats">
                      <h3 class="home">{{ team_name }}</h3>
                      <h3 class="away" >{{ match[0].opposition_name }}</h3>

                      <table class="stats-table">

                        <thead>
                        <tr>
                          <td class = "homeS">{{ homeGoals }} - {{ homePoints }}</td>
                          <th scope="col" colspan="2">Final Score</th>
                          <td class = "awayS" >{{ awayGoals }} - {{ awayPoints }}</td>
                        </tr>
                        <br>
                        </thead>

                        <tbody v-for="titles in stats">
                        <tr>
                          <td class = "homeST">{{ titles.home }}</td>
                          <th scope="col" colspan="2">{{ titles.title}}</th>
                          <td class = "awayST" >{{ titles.away }}</td>
                        </tr>
                        <br>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </v-tab>

                <v-tab title="Events TimeLine" v-if="match[0].match_status == 'complete'" class="active">
                  <br>
                  <table class="table table-striped" id = "events">
                    <thead class="thead-dark">
                    <tr>
                      <th scope="col">Minute</th>
                      <th scope="col">
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="line in collected">
                      <td>{{ line.collected_time }}'</td>
                      <td>{{ line.title }} for {{ line.team_name }} by number {{ line.player_number }}</td>
                    </tr>
                    </tbody>
                  </table>
                </v-tab>
              </vue-tabs>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import axios from "axios";
  import {VueTabs, VTab} from 'vue-nav-tabs'
  import 'vue-nav-tabs/themes/vue-tabs.css'

  export default {
    props: ['role', 'user', 'userID','selectedMatch','teamID', 'players', 'KPI_list' ,'teamExist','location','matchesDue', 'matchesComplete', 'team_name', 'team_type', 'awayTeams'],
    components: {
      Card,
      VueTabs,
      VTab
    },
    data() {
      return {
        homePoints: 0,
        homeGoals: 0,
        awayPoints: 0,
        awayGoals: 0,
        stats: [],
        collected: [],
        homeCollected: [],
        awayCollected: [],
        kpiTitles:[],
        match:[]
      }
    },
    mounted() {
      this.getMatch()
    },
    methods: {
      calculateStats() {
        var i
        for (i = 0; i < this.collected.length; i++) {
          if ((this.collected[i].kpi_id == 3 || this.collected[i].kpi_id == 5) && this.collected[i].team_id == this.match[0].teamHome_id) {
            this.homePoints++
          }
          if ((this.collected[i].kpi_id == 4 || this.collected[i].kpi_id == 6) && this.collected[i].team_id == this.match[0].teamHome_id) {
            this.homeGoals++
          }
          if ((this.collected[i].kpi_id == 3 || this.collected[i].kpi_id == 5) && this.collected[i].team_id == this.match[0].teamAway_id) {
            this.awayPoints++
          }
          if ((this.collected[i].kpi_id == 4 || this.collected[i].kpi_id == 6) && this.collected[i].team_id == this.match[0].teamAway_id) {
            this.awayGoals++
          }
          else {
          }
          this.assignTitles()
        }
      },
      getMatch(){
        var teamUser = {
          "match_id": this.selectedMatch,
        }
        axios({
          url: 'http://localhost:4000/getMatch',
          method: 'post',
          contentType: 'application/json',
          data: teamUser,
        }).then(result => {

          if (result.data.length != '0') {
            var resultsDue = []
            var resultsComplete = []

            if ( result.data[0].match_status == 'due') {
              var matchDue = {
                "match_id": result.data[0].match_id,
                "teamHome_id": result.data[0].teamHome_id,
                "teamAway_id": result.data[0].teamAway_id,
                "matchDaySquad_id": result.data[0].matchDaySquad_id,
                "match_competition": result.data[0].competition,
                "match_status": result.data[0].match_status,
                "match_date": result.data[0].dateMatch,
                "match_location": result.data[0].location,
                "opposition_name": result.data[0].opposition,
                "status": 'due'
              }
              resultsDue.push(matchDue);
              this.match = resultsDue
            }
            else {
              var matchComplete = {
                "match_id": result.data[0].match_id,
                "teamHome_id": result.data[0].teamHome_id,
                "teamAway_id": result.data[0].teamAway_id,
                "matchDaySquad_id": result.data[0].matchDaySquad_id,
                "match_competition": result.data[0].competition,
                "match_status": result.data[0].match_status,
                "match_date": result.data[0].dateMatch,
                "match_location": result.data[0].location,
                "opposition_name": result.data[0].opposition,
              }
              resultsComplete.push(matchComplete);
              this.match = resultsComplete
            }
          }
          this.getCollected()
        }).catch(error => {
          console.log(error);
        });
      },
      getCollected(){
        var teamUser = {
          "match_id": this.selectedMatch,
        }
        axios({
          url: 'http://localhost:4000/getCollected',
          method: 'post',
          contentType: 'application/json',
          data: teamUser,
        }).then(result => {

          if (result.data.length != '0') {
            var collectedKPI =[]
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

              var KPIBlank = {
                "kpi_id": result.data[i].kpi_id,
                "collected_id":0 ,
                "matchEvent_id": result.data[i].matchEvent_id,
                "collected_pitch_location": '',
                "collected_time": '',
                "team_id": '',
                "player_number": '',
                "quantity": 0
              }
              collectedKPI.push(KPI)

              if (result.data[i].team_id == this.teamID) {
                homeKPI.push(KPI)
                KPIBlank.team_id= result.data[i].team_id
                awayKPI.push(KPIBlank)
              }
              else {
                awayKPI.push(KPI)
                KPIBlank.team_id= this.teamID
                homeKPI.push(KPIBlank)
              }
            }
            this.homeCollected=homeKPI
            this.awayCollected=awayKPI
            this.collected=collectedKPI

            this.loopHome(result)
            this.loopAway(result)

            this.getTitles()
          }
        }).catch(error => {
          console.log(error);
        });
      },
      getTitles(){
        var n
        var dupeArray=[]
        var uniqueArray=[]
        for (n = 0; n < this.collected.length; n++) {

          var kpi = {
            "kpi_id": this.collected[n].kpi_id,
          }
          axios({
            url: 'http://localhost:4000/getKPIname',
            method: 'post',
            contentType: 'application/json',
            data: kpi,
          }).then(result => {
            var x
            var KPI = {
              "kpi_id": result.data[0].kpi_id,
              "kpi_title": result.data[0].kpi_title,
            }
            dupeArray.push(KPI)
            uniqueArray = this.removeDuplicates(dupeArray, 'kpi_id')
            this.kpiTitles = uniqueArray
            this.assignTitles()
          }).catch(error => {
            console.log(error);
          });
        }
          this.totalStatistics()
      },
      removeDuplicates(originalArray, prop) {
        var newArray = [];
        var lookupObject  = {};

        for(var i in originalArray) {
          lookupObject[originalArray[i][prop]] = originalArray[i];
        }

        for(i in lookupObject) {
          newArray.push(lookupObject[i]);
        }
        return newArray;
      },
      loopHome(result){
        var i
        var x
        var common = []
        var zero = []
        for (x = 0; x < result.data.length; x++ ) {
          for (i = 0; i < this.homeCollected.length; i++) {
            if (result.data[x].kpi_id == this.homeCollected[i].kpi_id && result.data[x].team_id == this.homeCollected[i].team_id && this.homeCollected[i].collected_id != 0) {
              this.homeCollected[i].quantity++
            }
          }
        }

        for(x = 0; x < this.homeCollected.length; x++) {
          for (i = 0; i < this.homeCollected.length; i++) {
            if (this.homeCollected[x].kpi_id == this.homeCollected[i].kpi_id && this.homeCollected[x].quantity > this.homeCollected[i].quantity ) {
              // this.awayCollected[i]='';
              this.homeCollected.splice(i, 1);
            }
          }
        }

        var uniqueArrayZ = this.removeDuplicates(this.homeCollected, "kpi_id");

        this.homeCollected=uniqueArrayZ

      },
      loopAway(result){
        var i
        var x
        var common = []
        var zero = []
        for (x = 0; x < result.data.length; x++ ) {
          for (i = 0; i < this.awayCollected.length; i++) {
            if (result.data[x].kpi_id == this.awayCollected[i].kpi_id && result.data[x].team_id == this.awayCollected[i].team_id && this.awayCollected[i].collected_id != 0) {
              this.awayCollected[i].quantity++
            }
          }
        }

        for(x = 0; x < this.awayCollected.length; x++) {
          for (i = 0; i < this.awayCollected.length; i++) {
            if (this.awayCollected[x].kpi_id == this.awayCollected[i].kpi_id && this.awayCollected[x].quantity > this.awayCollected[i].quantity ) {
              // this.awayCollected[i]='';
              this.awayCollected.splice(i, 1);
            }
          }
        }
        var uniqueArrayZ = this.removeDuplicates(this.awayCollected, "kpi_id");

        this.awayCollected=uniqueArrayZ

      },
      totalStatistics() {
        var x
        var i
        var stats = []

        for (x = 0; x < this.homeCollected.length; x++) {
          for (i = 0; i < this.awayCollected.length; i++) {
            if (this.homeCollected[x].kpi_id == this.awayCollected[i].kpi_id) {

              var KPI = {
                "kpi_id": this.homeCollected[x].kpi_id,
                "title": '',
                "home": this.homeCollected[x].quantity,
                "away": this.awayCollected[i].quantity,
              }
              stats.push(KPI)
            }
          }
        }
        this.stats=stats;
        this.calculateStats()
      },

      compare(a,b) {
      if (a.collected_time < b.collected_time)
      return -1;
      if (a.collected_time > b.collected_time)
      return 1;
      return 0;
      },

      assignTitles() {

      this.collected.sort(this.compare);

            var x
            var i
            var n
            for (x = 0; x < this.stats.length; x++) {
              for (i = 0; i < this.kpiTitles.length; i++) {
                if (this.stats[x].kpi_id == this.kpiTitles[i].kpi_id) {
                  this.stats[x].title = this.kpiTitles[i].kpi_title
                }
              }
            }

        for (x = 0; x < this.collected.length; x++) {
          if(this.collected[x].team_id == this.teamID){
            this.collected[x].team_name = this.team_name
          }
          else {
            this.collected[x].team_name = this.match[0].opposition_name
          }
          for (i = 0; i < this.kpiTitles.length; i++) {
            if (this.collected[x].kpi_id == this.kpiTitles[i].kpi_id) {
              this.collected[x].title = this.kpiTitles[i].kpi_title
            }
          }
        }

      },
      sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
          if ((new Date().getTime() - start) > milliseconds){
            break;
          }
        }
      },
      relocate_editMatch(){
          this.$router.push({ path: '/admin/matches/editMatch'})
        },
    },
  }
</script>
<style scoped lang="scss">
  @import '../../../assets/styles/app.scss';

  .card {
    width: 100%;
    margin:auto;
  }

  th {
    background-color: rgba(29,150,178,1);
    color: white;
    width: 50%;
    margin-left: 200%;
  }

  td {
    font-size: 1.2em;
  }

  .stats-table th {
    margin: auto;
    text-align: center;
  }

  .stats-table {
    margin: auto;
    width: 100%;
    text-align: center;
    clear: both;
  }

  .home {
    float: left;
    margin-left: 30px;
  }

  .away {
    float:right;
  }

  .container-stats {
    width: 60%;
    margin:auto;
    font-size: 1.1em;
  }

  .homeST {
    margin-left: -100px;
  }

  .awayST {
    margin-right: -100px;
  }

  button {
    float:right;
    margin-top: -50px;
  }

  #events {
    width: 85%;
    margin:auto;
  }

</style>
