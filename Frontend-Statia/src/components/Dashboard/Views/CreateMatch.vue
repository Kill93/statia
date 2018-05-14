<template>
  <div class="createMatch">
    <div class="container-fluid">

      <div class="home-panel">
        <div class="panel-heading">
          <strong> Create New Match!</strong>
        </div>
        <div class="panel panel-default">
          <div class="panel-body">
            <div class="row">
              <div class="col-lg-12">
                <form id="createTeam-form" role="form" style="display: block;">
                  <div class="form-group" id = "away">
                    <label for="sel1">Opposition Team:</label>
                    <select class="form-control" id = 'sel1' v-model="opposition" @change="checkvalue">
                      <option v-for="away in awayTeams" >{{ away.away_name }}</option>
                      <option > Other </option>
                    </select>
                  </div>
                  <div class="form-group" id = "newAway" style='display:none'>
                    <label for="teamNameA">Opposition:</label>
                    <input type="text" name="teamNameA" tabindex="1" v-model="opposition" class="form-control" value="">
                    </div>
                  <div class="form-group">
                    <label for="competition">Competition:</label>
                    <input type="text" name="competition" tabindex="1" v-model="competition" class="form-control" placeholder="Competition" value="">
                  </div>
                  <div class="form-group">
                    <label for="dom">Date of Match:</label><br>
                    <br>
                    <datepicker :disabled="disabled" placeholder="DD MMM YYYY"cd2 v-model="matchDate"></datepicker>
                  </div>
                  <div class="form-group">
                    <label for="matchLocation">Match Location:</label>
                    <input type="text" name="matchLocation" tabindex="1" v-model="matchLocation" class="form-control" placeholder="Match Location" value="">
                  </div>
                  <div class="form-group">
                    <div class="row">
                      <button type="button" @click="createMatch1" class="btn btn-success btn-lg">Create Match!</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>

  import axios from "axios";
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import Datepicker from 'vuejs-datepicker';

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth(); //January is 0!
  var yyyy = today.getFullYear();

  export default {
    props: ['role', 'user', 'userID', 'teamID', 'players', 'KPI_list' ,'teamExist','location', 'team_name', 'team_type', 'awayTeams'],
    components: {
      Card,
      'datepicker': Datepicker
    },
    data() {
      return {
        awayTeams: [],
        opposition: '',
        oppLocation: '',
        competition: '',
        matchDate: '',
        matchLocation: '',
        oppID: '',
        // disabled: {
        //   to: new Date(yyyy, mm, dd), // Disable all dates up to specific date
        // }
      }
    },
    mounted() {
      this.getAwayTeams()
    },
    methods: {
      getAwayTeams() {
        var teamUser = {
          "userID": this.userID,
        }
        axios({
          url: 'https://matches-microservice.cfapps.io/getAwayTeam',
          method: 'post',
          contentType: 'application/json',
          data: teamUser,
        }).then(result => {

          if (result.data.length != '0') {
            var results = []

            for (var i = 0; i < result.data.length; i++) {
              var away = {
                "away_id": result.data[i].away_id,
                "away_name": result.data[i].away_name,
              }
              results.push(away);
            }
            this.awayTeams = results
          }
        }).catch(error => {
          console.log(error);
        });
      },
      checkvalue() {
        if (this.opposition === "Other")
          document.getElementById("newAway").setAttribute("style", "display: " + 'block')
        else if (this.opposition !== "Other")
          document.getElementById("newAway").setAttribute("style", "display:" + 'none')
      },
      createMatch1() {
        var i
        for (i = 0; i < this.awayTeams.length; i++) {
          if (this.awayTeams[i].away_name == this.opposition)
            this.oppID = this.awayTeams[i].away_id
        }

        if (this.oppID == '') {
          this.oppID = this.createTeam()
        }
        else {
          this.createMatch2()
        }
      },
        createMatch2() {
        var logMatch = {
          "teamHome_id": this.teamID,
          "teamAway_id": this.oppID,
          "matchDaySquad_id": 1,
          "competition": this.competition,
          "match_status": 'due',
          "dateMatch": this.matchDate,
          "location": this.matchLocation,
          "teamAway_name": this.opposition
        }
        console.log(logMatch)
        axios({
          url: 'https://matches-microservice.cfapps.io/createMatch',
          method: 'post',
          contentType: 'application/json',
          data: logMatch,
        }).then(result => {
          if (result.data.status == 'success') {
            this.$router.push({ path: '/admin/matches'});
          }
        }).catch(error => {
          console.log(error);
        });
      },
      createTeam() {
        var logTeam = {
          "userID": this.$store.getters['getUserID'],
          "teamName": this.opposition,
          "location": '',
          "teamType": 'away',
        }
        axios({
          url: 'https://team-microservice.cfapps.io/createTeam',
          method: 'post',
          contentType: 'application/json',
          data: logTeam,
        }).then(result => {
          if (result.data.status == 'success') {
            this.oppID = result.data.team_id
            console.log(this.oppID + 'oppID')
            this.createMatch2()
          }
        }).catch(error => {
          console.log(error);
        });
      },
      sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
          if ((new Date().getTime() - start) > milliseconds){
            break;
          }
        }
      },
    }
  }
</script>
<style scoped lang="scss">
  @import '../../../assets/styles/app.scss';

  .manage {
    min-height: 800px;
  }

  .home-panel
  {
    text-align: center;
    margin: auto;
    margin-top: 10%;
    width: 60%;
  }

  button {
    text-align: center;
    margin: auto;
  }

  label {
    float: left;
  }

  form span {
    color: red;
    float: right;
  }

  span{
    //color: #40a0e0;
    //float: right;
    //font-size: 2vw;
    //margin-top: -8%;
  }

  table {
    font-size: 1.5em;
  }

  #playersTable, #KPITable {
    height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  #editButton, #addKPI{
    float:right;
    margin-top: -7%;
  }

  h3 {
    font-size: 1.5vw;
    text-align: center;
  }

  .header{
    margin:auto;
    text-align: center;
    margin-bottom: 20px;
    color: rgb(62, 62, 62);
    font-size: 22px;
    font-weight: 900;
    text-transform: uppercase;
    padding: 0 !important;
  }

</style>
