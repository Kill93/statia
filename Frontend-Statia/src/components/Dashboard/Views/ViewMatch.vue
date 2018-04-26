<template>
  <div class="viewMatch">

    <i v-show="loading" class="fa fa-spinner fa-spin"></i>


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
              <button class="btn btn-warning" @click.prevent="playerStats">Edit Match Details<i class="glyphicon glyphicon-edit"></i></button>
            </template>
              <vue-tabs>
                <v-tab title="Statistics" v-if="match[0].match_status == 'complete'">
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
                          <th scope="col" :id=titles.kpi_id colspan="2">{{ titles.title}}</th>
                          <td class = "awayST" >{{ titles.away }}</td>
                        </tr>
                        <!--<tr :id="titles.kpi_id" display="none">-->
                          <!--<td class = "homeST">{{ titles.home }}</td>-->
                          <!--<th scope="col" :id=titles.kpi_id colspan="2">{{ titles.title}}</th>-->
                          <!--<td class = "awayST" >{{ titles.away }}</td>-->
                        <!--</tr>-->
                        <br>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </v-tab>

                <v-tab title="Player Statistics" @click.prevent="playerStats">
                  <div class="container-stats" >
                    <div class = "stats">
                      <table class="players-table">
                        <tbody v-for="titles in playerKPITitles">
                        <tr>
                          <th class = "playerKPI" > {{ titles.title}} </th>
                        </tr>
                        <tr>
                          <td class = "note1" > {{ playa(titles.title, 'home') }} </td>
                          <td class = "note2" > {{ playa(titles.title, 'away') }}</td>
                        </tr>
                        <!--<tr>-->
                        <!--<td class = "homeST">{{ titles.player_name }}</td>-->
                        <!--<th scope="col" colspan="2">{{ titles.kpi_title}}</th>-->
                        <!--<td class = "awayST" >{{ titles.quantity }}</td>-->
                        <!--</tr>-->
                        <br>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </v-tab>


                <v-tab title="Ratios" v-if="match[0].match_status == 'complete'">
                  <div class="container-stats" >
                    <div class = "ratios">
                      <table class="stats-table">
<br>
                        <tbody>
                        <tr>
                          <th scope="col">Goal Conversion Rate</th>
                          <td class = "match">1 in {{ GoalRatios }}</td>
                        </tr>
<br>
                        <tr>
                          <th scope="col">Point Conversion Rate</th>
                          <td class = "match">1 in {{ PointRatios }}</td>
                        </tr>

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
  import swal from 'sweetalert'

  export default {
    props: ['role', 'user', 'userID','selectedMatch','teamID', 'players', 'KPI_list' ,'teamExist','location','matchesDue', 'matchesComplete', 'team_name', 'team_type', 'awayTeams'],
    components: {
      Card,
      VueTabs,
      VTab
    },
    data() {
      return {
        loading: false,
        homePoints: 0,
        homeGoals: 0,
        awayPoints: 0,
        awayGoals: 0,
        stats: [],
        collected: [],
        homeCollected: [],
        awayCollected: [],
        kpiTitles:[],
        match:[],
        PointRatios: '',
        GoalRatios: '',
        homePlayerStats: [],
        awayPlayerStats: [],
        divStats:[],
        playerKPITitles:[],
      }
    },
    mounted() {
      this.getMatch()

      // this.getMatch()
      // swal("Loading Match Statistics!", {
      //   icon: "success",
      //   timer: 2000,
      //   button: false,
      // })
      // this.playerStats()
    },
    methods: {
      calculateStats() {
        var i
        for (i = 0; i < this.collected.length; i++) {
          if ((this.collected[i].kpi_id == 4 || this.collected[i].kpi_id == 6) && this.collected[i].team_id == this.match[0].teamHome_id) {
            this.homePoints++
          }
          if ((this.collected[i].kpi_id == 5 || this.collected[i].kpi_id == 7) && this.collected[i].team_id == this.match[0].teamHome_id) {
            this.homeGoals++
          }
          if ((this.collected[i].kpi_id == 4 || this.collected[i].kpi_id == 6) && this.collected[i].team_id == this.match[0].teamAway_id) {
            this.awayPoints++
          }
          if ((this.collected[i].kpi_id == 5 || this.collected[i].kpi_id == 7) && this.collected[i].team_id == this.match[0].teamAway_id) {
            this.awayGoals++
          }
          else {
          }
        }

      },
      getMatch() {
        var teamUser = {
          "match_id": this.selectedMatch,
        }
        axios({
          url: 'https://matches-microservice.cfapps.io/getMatch',
          method: 'post',
          contentType: 'application/json',
          data: teamUser,
        }).then(result => {

          if (result.data.length != '0') {
            var resultsDue = []
            var resultsComplete = []

            if (result.data[0].match_status == 'due') {
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
      getCollected() {
        var teamUser = {
          "match_id": this.selectedMatch,
        }
        axios({
          url: 'https://matches-microservice.cfapps.io/getCollected',
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
                "player_id": result.data[i].player_id,
                "player_name": '',
                "team_name": '',
                "quantity": 0
              }

              var KPIBlank = {
                "kpi_id": result.data[i].kpi_id,
                "collected_id": 0,
                "matchEvent_id": result.data[i].matchEvent_id,
                "collected_pitch_location": '',
                "collected_time": '',
                "team_id": '',
                "player_number": '',
                "player_id": '',
                "quantity": 0
              }
              collectedKPI.push(KPI)

              if (result.data[i].team_id == this.teamID) {
                homeKPI.push(KPI)
                KPIBlank.team_id = result.data[i].team_id
                awayKPI.push(KPIBlank)
              }
              else {
                awayKPI.push(KPI)
                KPIBlank.team_id = this.teamID
                homeKPI.push(KPIBlank)
              }
            }
            this.homeCollected = homeKPI
            this.awayCollected = awayKPI
            this.collected = collectedKPI

            this.loopHome(result)
            this.loopAway(result)

            // this.getTitles()
            this.getRatios()
            this.getTitles()
          }
        }).catch(error => {
          console.log(error);
        });
      },
      getTitles() {
        console.log('getTitles')
        var n
        var dupeArray = []
        var uniqueArray = []
        for (n = 0; n < this.collected.length; n++) {

          var kpi = {
            "kpi_id": this.collected[n].kpi_id,
          }
          axios({
            url: 'https://matches-microservice.cfapps.io/getKPIname',
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
            this.playerStats();
          }).then(error => {
            console.log(error);
          }).catch(error => {
            console.log(error);
          });
        }
        this.totalStatistics()
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
      loopHome(result) {
        var i
        var x
        var common = []
        var zero = []
        for (x = 0; x < result.data.length; x++) {
          for (i = 0; i < this.homeCollected.length; i++) {
            if (result.data[x].kpi_id == this.homeCollected[i].kpi_id && result.data[x].team_id == this.homeCollected[i].team_id && this.homeCollected[i].collected_id != 0) {
              this.homeCollected[i].quantity++
            }
          }
        }

        for (x = 0; x < this.homeCollected.length; x++) {
          for (i = 0; i < this.homeCollected.length; i++) {
            if (this.homeCollected[x].kpi_id == this.homeCollected[i].kpi_id && this.homeCollected[x].quantity > this.homeCollected[i].quantity) {
              this.homeCollected[i]='';
              // this.homeCollected.splice(i, 1);
            }
          }
        }

        var uniqueArrayZ = this.removeDuplicates(this.homeCollected, "kpi_id");

        this.homeCollected = uniqueArrayZ

      },
      loopAway(result) {
        var i
        var x
        for (x = 0; x < result.data.length; x++) {
          for (i = 0; i < this.awayCollected.length; i++) {
            if (result.data[x].kpi_id == this.awayCollected[i].kpi_id && result.data[x].team_id == this.awayCollected[i].team_id && this.awayCollected[i].collected_id != 0) {
              this.awayCollected[i].quantity++
            }
          }
        }

        for (x = 0; x < this.awayCollected.length; x++) {
          for (i = 0; i < this.awayCollected.length; i++) {
            if (this.awayCollected[x].kpi_id == this.awayCollected[i].kpi_id && this.awayCollected[x].quantity > this.awayCollected[i].quantity) {
              this.awayCollected[i]='';
              // this.awayCollected.splice(i, 1);
            }
          }
        }
        var uniqueArrayZ = this.removeDuplicates(this.awayCollected, "kpi_id");

        this.awayCollected = uniqueArrayZ

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
        this.stats = stats;
        this.calculateStats()
      },

      compare(a, b) {
        if (a.collected_time < b.collected_time)
          return -1;
        if (a.collected_time > b.collected_time)
          return 1;
        return 0;
      },

      assignTitles() {

        console.log('Assign')
        console.log(this.kpiTitles)

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
          if (this.collected[x].team_id == this.teamID) {
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
          if ((new Date().getTime() - start) > milliseconds) {
            break;
          }
        }
      },
      relocate_editMatch() {
        this.$router.push({path: '/admin/matches/editMatch'})
      },
      getRatios() {
        var pointAttempts = 0
        var points = 0
        var goalAttempts = 0
        var goals = 0

        for (var x = 0; x < this.collected.length; x++) {
          if (this.collected[x].team_id == this.teamID) {
            if (this.collected[x].kpi_id == 4 || this.collected[x].kpi_id == 8 || this.collected[x].kpi_id == 6 || this.collected[x].kpi_id == 11) {
              pointAttempts++
            }
            if (this.collected[x].kpi_id == 5 || this.collected[x].kpi_id == 7 || this.collected[x].kpi_id == 9 || this.collected[x].kpi_id == 10) {
              goalAttempts++
              console.log(this.collected[x])
            }
          }
        }

        for (var x = 0; x < this.collected.length; x++) {
          if (this.collected[x].team_id == this.teamID) {
            if (this.collected[x].kpi_id == 4 || this.collected[x].kpi_id == 6) {
              points++
            }
            if (this.collected[x].kpi_id == 5 || this.collected[x].kpi_id == 7) {
              goals++
              console.log(this.collected[x])
            }
          }
        }

        this.PointRatios = pointAttempts / points
        this.GoalRatios = goalAttempts / goals
      },
      playerStats() {

        this.assignTitles()
        var homePlayers = []
        var awayPlayers = []
        for (var i = 0; i < this.collected.length; i++) {
          if (this.collected[i].player_id != '' && this.collected[i].team_id == this.teamID) {
            var homeStat = {
              "player_id": this.collected[i].player_id,
              "player_name": '',
              "kpi_title": this.collected[i].title,
              "team_id": this.collected[i].team_id,
              "quantity": 0
            }
            homePlayers.push(homeStat)
          }
          if (this.collected[i].player_number != '' && this.collected[i].team_id == this.match[0].teamAway_id) {
            var awayStat = {
              "player_number": this.collected[i].player_number,
              "kpi_title": this.collected[i].title,
              "team_id": this.collected[i].team_id,
              "quantity": 0
            }
            awayPlayers.push(awayStat)
          }
        }

        for (var x = 0; x < homePlayers.length; x++) {
          for (i = 0; i < this.players.length; i++) {
            if (homePlayers[x].player_id == this.players[i].playerID) {
              console.log('oioi')
              homePlayers[x].player_name = this.players[i].firstName + ' ' + this.players[i].lastName
            }
          }
        }

        console.log(homePlayers)
        // console.log(awayPlayers)
        this.loopHomePlayers(homePlayers)
        this.loopAwayPlayers(awayPlayers)
      },
      loopHomePlayers(homeKPI) {
        var i
        var x
        for (x = 0; x < this.collected.length; x++) {
          for (i = 0; i < homeKPI.length; i++) {
            if (this.collected[x].title == homeKPI[i].kpi_title && this.collected[x].team_id == homeKPI[i].team_id && this.collected[x].player_id == homeKPI[i].player_id) {
              homeKPI[i].quantity++
            }
          }
        }

        var uniqueArrayZ = this.removeDuplicates(homeKPI, "player_id");

        this.homePlayerStats = uniqueArrayZ
        console.log(this.homePlayerStats)

        var uniqueArrayY = this.removeDuplicates(this.collected, "title");
        this.playerKPITitles = uniqueArrayY
        console.log(this.playerKPITitles)

        // for (var x = 0; x < this.homePlayerStats.length; x++) {
        //   for (var n = 0; n < this.homePlayerStats.length; n++) {
        //     if (this.homePlayerStats[x] == 1) {
        //     }
        //   }
        // }

        // console.log(this.homePlayerStats)
      },
      loopAwayPlayers(awayKPI) {
        var i
        var x
        var common = []
        var zero = []
        for (x = 0; x < this.collected.length; x++) {
          for (i = 0; i < awayKPI.length; i++) {
            if (this.collected[x].title == awayKPI[i].kpi_title && this.collected[x].team_id == awayKPI[i].team_id && this.collected[x].player_number == awayKPI[i].player_number) {
              awayKPI[i].quantity++
            }
          }
        }

        // for (x = 0; x < awayKPI.length; x++) {
        //   for (i = 0; i < awayKPI.length; i++) {
        //     if (awayKPI[x].kpi_title == awayKPI[i].kpi_id && awayKPI[x].quantity > awayKPI[i].quantity) {
        //       awayKPI.splice(i, 1);
        //     }
        //   }
        // }

        var uniqueArrayZ = this.removeDuplicates(awayKPI, "player_number");

        this.awayPlayerStats = uniqueArrayZ


      },
      playa(title, type) {
        var results = ''
        var quantity = ''
        if (type == 'home') {
          for (var x = 0; x < this.homePlayerStats.length; x++) {
            if (this.homePlayerStats[x].kpi_title == title && this.homePlayerStats[x].player_name != '') {
              results += this.homePlayerStats[x].quantity + ' ' + this.homePlayerStats[x].player_name + '\n'
            }
          }
        }
        if (type == 'away') {
          for (var x = 0; x < this.awayPlayerStats.length; x++) {
            if (this.awayPlayerStats[x].kpi_title == title && this.awayPlayerStats[x].player_number != '') {
              results += this.awayPlayerStats[x].quantity + ' by Number ' + this.awayPlayerStats[x].player_number + '\n'
            }
          }
        }

        return results
      }
    }
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

  .players-table {
    margin: auto;
    width: 100%;
    text-align: center;
    clear: both;
  }

  .players-table th {
    width: 100%;
    margin: auto;
    text-align: center;
  }

  .note1 {
    white-space: pre-line;
    float: left;
    width: 50%;
  }

  .note2 {
    white-space: pre-line;
    float: right;
    width: 50%;
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

  .swal {
    background-color: rgba(63,255,106,0.69);
    border: 3px solid white;
  }

</style>
