<template>
  <div class="wrapper">
    <side-bar>
      <!--<mobile-menu slot="content"></mobile-menu>-->
      <sidebar-link v-if="user == 'guest'" to="/admin/home">
        <i class="glyphicon glyphicon-home"></i>
        <p>Home</p>
      </sidebar-link>
      <sidebar-link v-if="user != 'guest'" to="/admin/dashboard" >
        <i class="glyphicon glyphicon-dashboard"></i>
        <p>Dashboard {{ selectedMatch }}</p>
      </sidebar-link>
      <sidebar-link v-if="user != 'guest' && role == 'Coach'" to="/admin/manage-team">
        <i class="glyphicon glyphicon-briefcase"></i>
        <p>Manage Team </p>
      </sidebar-link>
      <sidebar-link v-if="user != 'guest' && role == 'Coach'" to="/admin/matches">
        <i class="glyphicon glyphicon-duplicate"></i>
        <p>Matches</p>
      </sidebar-link>
      <sidebar-link v-if="user != 'guest' && role == 'Coach'" to="/admin/analysis">
        <i class="glyphicon glyphicon-stats"></i>
        <p>Analysis {{playerAccountID}}</p>
      </sidebar-link>
      <sidebar-link v-if="user == 'guest'" to="/admin/login">
        <i class="glyphicon glyphicon-log-in"></i>
        <p>LOGIN</p>
      </sidebar-link>
      <sidebar-link v-if="user == 'guest'" to="/admin/register">
        <i class="glyphicon glyphicon-user"></i>
        <p>REGISTER</p>
      </sidebar-link>
    </side-bar>
    <div class="main-panel">
      <top-navbar @isLoggedIn="isLoggedIn" :user="user" :role="role" :userID="userID"></top-navbar>

      <dashboard-content @getMatchesP="getMatchesP" @getMatchDataP="getMatchDataP"  @click="toggleSidebar" @emitPlayerID="emitPlayerID" @selectMatch="selectMatch" @updateMatches="updateMatches" @getTeam="getTeam" @getKPI_list="getKPI_list" :selectedMatch="selectedMatch" :user="user" :role="role" :userID="userID" :KPI_list="KPI_list" :players="players" :teamID="teamID" :location="location" :team_name="team_name" :team_type="team_type" :matchesDue="matchesDue" :matchesReady="matchesReady" :matchesComplete="matchesComplete" :teamExist="teamExist" :playerAccountID="playerAccountID" :matchIDs="matchIDs" :matchesP="matchesP" >

      </dashboard-content>

    </div>
  </div>
</template>
<script>

  /* eslint-disable */
  import { mapGetters, mapActions } from 'vuex'
  import axios from "axios";
  import TopNavbar from './TopNavbar.vue'
  import DashboardContent from './Content.vue'
  import MobileMenu from './MobileMenu.vue'

  export default {
    components: {
      TopNavbar,
      DashboardContent,
      MobileMenu
    },
    data() {
      return {
        user: 'guest',
        role: this.$store.state.role,
        userID: this.$store.state.userID,
        token: this.$store.state.token,
        teamID: '',
        teamExist: '',
        location: '',
        team_name: '',
        team_type: '',
        players: [],
        KPI_list:[],
        MATCH_list:[],
        awayTeams: [],
        matchesDue:[],
        matchesComplete:[],
        matchesReady:[],
        selectedMatch: '',
        playerAccountID: '',
        matchIDs: [],
        matchesP: [],
      }
    },
    computed: mapGetters([
      'getToken',
      'getUserID',
      'getUser',
      'getRole'
    ]),
    mounted() {
      this.getKPI_list(),
      this.isLoggedIn(),
      this.getTeam()
      if (this.role == 'Player'){
        this.getMatchesP()
      }
    },
    methods: mapActions([
      'addToken',
      'removeToken',
    ]),
    methods: {
      logout() {
        this.$store.commit('removeToken', 1)
        this.$router.push({ path: 'home'})
        location.reload()
      },
      isLoggedIn(){
        var loggedIn = localStorage.getItem('user')
        if (loggedIn != 'guest' && loggedIn != null) {
          this.user = this.$store.getters['getUser'],
          this.role = this.$store.getters['getRole'],
          this.userID = this.$store.getters['getUserID'],
          this.token = this.$store.getters['token']
          console.log('User ' + this.user + ' already logged in')
        }
        else {
          this.$store.state.user = 'guest',
            this.$store.state.role = '',
            this.$store.state.userID = '',
            this.$store.state.token = ''
          console.log('User not logged in')
        }
      },
      getMatches(){
        var teamUser = {
          "team_id": this.teamID,
        }
        axios({
          url: 'https://matches-microservice.cfapps.io/matches',
          method: 'post',
          contentType: 'application/json',
          data: teamUser,
        }).then(result => {

          if (result.data.length != '0') {
            var i
            var resultsDue = []
            var resultsComplete = []
            var resultsReady = []

            for (i = 0; i < result.data.length; i++) {

              if ( result.data[i].match_status == 'due') {
                var matchesDue = {
                  "match_id": result.data[i].match_id,
                  "teamHome_id": result.data[i].teamHome_id,
                  "teamAway_id": result.data[i].teamAway_id,
                  "matchDaySquad_id": result.data[i].matchDaySquad_id,
                  "match_competition": result.data[i].competition,
                  "match_status": result.data[i].match_status,
                  "match_date": result.data[i].dateMatch,
                  "match_location": result.data[i].location,
                  "opposition_name": result.data[i].opposition,
                }
                resultsDue.push(matchesDue);
              }
              else if (result.data[i].match_status == 'complete'){
                var matchesComplete = {
                  "match_id": result.data[i].match_id,
                  "teamHome_id": result.data[i].teamHome_id,
                  "teamAway_id": result.data[i].teamAway_id,
                  "matchDaySquad_id": result.data[i].matchDaySquad_id,
                  "match_competition": result.data[i].competition,
                  "match_status": result.data[i].match_status,
                  "match_date": result.data[i].dateMatch,
                  "match_location": result.data[i].location,
                  "opposition_name": result.data[i].opposition,
                }
                resultsComplete.push(matchesComplete);
              }
              else {
                var matchesReady = {
                  "match_id": result.data[i].match_id,
                  "teamHome_id": result.data[i].teamHome_id,
                  "teamAway_id": result.data[i].teamAway_id,
                  "matchDaySquad_id": result.data[i].matchDaySquad_id,
                  "match_competition": result.data[i].competition,
                  "match_status": result.data[i].match_status,
                  "match_date": result.data[i].dateMatch,
                  "match_location": result.data[i].location,
                  "opposition_name": result.data[i].opposition,
                }
                resultsReady.push(matchesReady);
              }
            }
            this.matchesDue = resultsDue
            this.matchesComplete = resultsComplete
            this.matchesReady = resultsReady
          }

        }).catch(error => {
          console.log(error);
        });
      },
      getTeam(){
        var teamUser = {
          "user_id": this.$store.getters['getUserID'],
        }

        axios({
          url: 'https://team-microservice.cfapps.io/getTeam',
          method: 'post',
          contentType: 'application/json',
          data: teamUser,
        }).then(result => {
          if (result.data.status == "none") {
            this.teamExist = 'no'
            console.log('No team for user yet ' + this.teamExist)
            this.location=''
            this.team_name=''
            this.team_type=''
          }
          if (result.data.status == "success") {
            this.teamExist = 'yes'
            // this.$emit('updateTeamID', result.data.team_id);
            // this.updateTeamID(result.data.team_id)
            this.teamID = result.data.team_id
            this.location = result.data.location
            this.team_name = result.data.team_name
            this.team_type=result.data.team_type

            var IDTeam = {
              "team_id": this.teamID,
            }
            var i
            var results = []
            console.log(this.teamID + 'teamID')
            axios({
              url: 'https://team-microservice.cfapps.io/getPlayers',
              method: 'post',
              contentType: 'application/json',
              data: IDTeam,
            }).then(result => {
              if (result.data.length != '0') {
                for (i = 0; i < result.data.length; i++) {
                  var player = {
                    "playerID": result.data[i].player_id,
                    "teamID": this.teamID,
                    "firstName": result.data[i].player_firstName,
                    "lastName": result.data[i].player_lastName,
                    "userID": result.data[i].user_id,
                  }
                  results.push(player);
                }
                this.players = results
              }
              this.getMatches()
            }).catch(error => {
              console.log(error);
            });
          }
        }).catch(error => {
          console.log(error);
        });
      },
      getKPI_list(){
        var teamUser = {
          "user_id": this.$store.getters['getUserID'],
        }

        axios({
          url: 'https://team-microservice.cfapps.io/getKPI_List',
          method: 'post',
          contentType: 'application/json',
          data: teamUser,
        }).then(result => {
            var i
            var results = []
            if (result.data.length != '0') {
              for (i = 0; i < result.data.length; i++) {
                var KPILIST = {
                  "KPI_id": result.data[i].KPI_id,
                  "KPI_title": result.data[i].KPI_title,
                  "KPI_description": result.data[i].KPI_description,
                  "KPI_type": result.data[i].KPI_type,
                }
                results.push(KPILIST);
              }
              this.KPI_list = results
            }
        }).catch(error => {
          console.log(error);
        });
      },
      selectMatch(id) {
        this.selectedMatch = id;
      },
      updateMatches(id) {
        this.getMatches()
      },
      sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
          if ((new Date().getTime() - start) > milliseconds){
            break;
          }
        }
      },
      getAllKPITitles() {
        this.getMatches()
      },
      toggleSidebar () {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false)
        }
      },
      emitPlayerID(player_id){
        this.playerAccountID = player_id;
      },
      getMatchesP(){
        var teamUser = {
          "user_id": this.userID,
        }
        axios({
          url: 'https://matches-microservice.cfapps.io/getPMatches',
          method: 'post',
          contentType: 'application/json',
          data: teamUser,
        }).then(result => {

          console.log(teamUser)

          if (result.data.length != '0') {
            var i
            var results = []

            for (i = 0; i < result.data.length; i++) {

              var matchesDue = {
                "player_id": result.data[i].player_id,
                "matchEvent_id": result.data[i].matchEvent_id,
              }
              results.push(matchesDue);
            }

            var uniqueArrayZ = this.removeDuplicates(results, "matchEvent_id");

            this.matchIDs = uniqueArrayZ

            this.emitPlayerID(this.matchIDs[0].player_id)

            this.getMatchDataP()
          }

        }).catch(error => {
          console.log(error);
        });
      },
      getMatchDataP(){

        var Pmatches = []

        for (var x = 0; x < this.matchIDs.length; x++ ) {
          var teamUser = {
            "match_id": this.matchIDs[x].matchEvent_id,
          }

          axios({
            url: 'https://matches-microservice.cfapps.io/getMatch',
            method: 'post',
            contentType: 'application/json',
            data: teamUser,
          }).then(result => {

            if (result.data.length != '0') {
              var i
              var results = []

              console.log(result.data[0].status)

              if ( result.data[0].status == 'success') {

                var matchesDue = {
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
                console.log(matchesDue)
                this.matchesP.push(matchesDue)
              }
            }
          }).catch(error => {
            console.log(error);
          });
        }
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
    }
  }

</script>

<style scoped lang="scss">
  @import '../../../assets/styles/app.scss';

</style>
