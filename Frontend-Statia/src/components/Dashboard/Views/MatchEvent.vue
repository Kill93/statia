<template>
  <div class="matchevent">

    <sweet-modal ref = 'mod' overlay-theme = "dark">
      <table class="table">
        <tbody>
        <tr>
          <th scope="col">Team</th>
          <td class = "match">
            <select v-model="team" class="form-control">
              <option> {{ team_name}} </option>
              <option> {{ opposition }} </option>
            </select>
          </td>
        </tr>
        <tr>
          <th scope="col">Action</th>
          <td class = "match">{{ kpiCollected }}</td>
        </tr>
        <tr>
          <th scope="col">Time</th>
          <td class = "match">{{ timeCollected }}</td>
        </tr>
        <tr v-if="team == team_name">
          <th scope="col">Player</th>
          <td class = "match">{{playerCollected}}</td>
        </tr>
        <tr v-if="team == opposition" >
          <th scope="col">Player Number</th>
          <td class = "match">
            <select v-model="playerNumber" class="form-control">
              <option v-for="index in 35"> {{ index }} </option>
            </select></td>
        </tr>
        <tr>
          <th scope="col">Pitch Region</th>
          <td class = "match">
            <select v-model="locationCollected" class="form-control" >
              <option id="null"></option>
              <option  value="Opposition Third" >{{ items[0].region }}</option>
              <option  value="Middle" >{{ items[1].region }}</option>
              <option  value="Own Third" >{{ items[2].region }}</option>
            </select>
          </td>
        </tr>
        </tbody>
        <button type="button" @click="collectKPI" class="btn btn-success btn-lg">Save!</button>
      </table>
    </sweet-modal>

    <sweet-modal ref = 'swap' overlay-theme = "dark">
      <h2> Make a Substitution</h2>

      <table class="table">
        <tbody>
        <tr>
          <th scope="col">SUB</th>
          <td class = "match">{{ subName }}</td>
        </tr>
        <tr>
          <th scope="col">Swap For:</th>
          <td class = "match">
            <select v-model="subOFF" class="form-control">
              <option v-for="positions in squadmembers" v-if="positions.position != 'SUB'"> {{ positions.player_name }}</option>
            </select>
          </td>
          <button type="button" @click="confirmSub" class="btn btn-success btn-lg">Confirm!</button>
        </tr>
        </tbody>
      </table>
    </sweet-modal>

    <sweet-modal ref = 'time' overlay-theme = "dark">

      <table class="table" id = "timeTable">
        <tbody>
        <tr>
          <th scope="col">TIME</th>
          <td class><input type="number" v-model="minutes"> : <input type="text" v-model="seconds"></td>
        </tr>
        <button type="button" @click="closeTime" class="btn btn-success btn-lg">Save!</button>
        </tbody>
      </table>
    </sweet-modal>

    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card>
            {{ kpis.length }}
         <div class="frame">
           <div class="parent1">
             <ul class="nav">
               <li class = "teams">{{ team_name}}</li>
               <li class = "score">{{homeGoals}} - {{homePoints}}</li>
               <li class = 'time' @click="changeTime" >{{ minutes }} : {{ seconds }}</li>
               <li class = "score">{{awayGoals}} - {{awayPoints}}</li>
               <li class = "teams">{{ opposition }}</li>
             </ul>
           </div>
            <div id="pitch">
              <div class="container-fluid" id = "analysis" v-if="liveKPIs=='yes'">
                <vue-tabs>
                  <v-tab title="Team Statistics">
                    <div class="container-stats" >
                      <div class = "stats">
                        <table class="stats-table">

                          <tbody v-for="titles in stats">
                          <tr>
                            <td class = "homeST">{{ titles.home }}</td>
                            <th scope="col" colspan="2">{{ titles.title}}</th>
                            <td class = "awayST" >{{ titles.away }}</td>
                          </tr>
                          <!--<tr :id='titles.kpi_title' style="visibility: hidden">-->
                            <!--<td class = "homeST">{{ titles.player_name }} : {{ titles.quantity }}</td>-->
                            <!--<td class="hi" scope="col" colspan="2"></td>-->
                            <!--<td class = "awayST" >{{ titles.player_number }} : {{ titles.quantity }}</td>-->
                          <!--</tr>-->
                          <br>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </v-tab>

                  <v-tab title="Player Statistics">
                    <div class="container-stats" >
                      <div class = "stats">
                        <table class="stats-table">
                          <tbody v-for="titles in playerKPITitles">
                          <tr>
                            <th class = "playerKPI" > {{ titles.kpi_title}} </th>
                          </tr>
                          <tr>
                            <td class = "note1" > {{ playa(titles.kpi_title, 'home') }} </td>
                            <td class = "note2" > {{ playa(titles.kpi_title, 'away') }}</td>
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

                  <v-tab title="Events TimeLine" class="active">
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
                    <tr v-for="line in kpiListCollected">
                    <td>{{ line.time }}'</td>
                    <td>{{ line.kpi_title }} for {{ line.team_id }} by number {{ line.player }}</td>
                    </tr>
                    </tbody>
                    </table>
                  </v-tab>
                </vue-tabs>

              </div>
            <div id = "matchScreen">
                <div id="left" v-if="liveKPIs=='no'">
                  <ul>
                    <li class="li" v-for="m in left" :id=m.kpi_title v-on:click.prevent='selectKPI(m.kpi_title,m.kpi_id)'>
                      <a>{{ m.kpi_title }}</a>
                    </li>
                  </ul>
                </div>
                <div id="middle" v-if="liveKPIs=='no'">
                  <img id="pitchSVG" src="../../../../static/img/pitch.svg">
                  <div id="player">
                    <div v-for="positions in squadmembers" v-if="positions.position != 'SUB'">
                      <div class="circle" :id=positions.position v-on:click.prevent='select(positions.position, positions.player_name, positions.player_id)' >
                        {{ positions.squad_number }}
                        <i>{{ positions.player_name }}</i>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="right" v-if="liveKPIs=='no'">
                  <ul>
                    <li class="li" v-for="m in right" :id=m.kpi_title v-on:click.prevent='selectKPI(m.kpi_title,m.kpi_id)'>
                      {{ m.kpi_title }}
                    </li>
                  </ul>
              </div>
            </div>
         </div>

           <!--<h2> Substitutes</h2>-->
           <!--<div class = "parent3" v-if="liveKPIs=='no'">-->
               <!--<ul class="nav">-->
                 <!--<li v-for="positions in squadmembers" v-if="positions.position == 'SUB'" v-on:click.prevent='makeSub(positions.player_name, positions.player_id, positions.position)'>-->
                   <!--<div class="circleS" :id=positions.position>-->
                     <!--{{ positions.squad_number }}-->
                     <!--<i>{{ positions.player_name }}</i>-->
                   <!--</div>-->
                 <!--</li>-->
               <!--</ul>-->
           <!--</div>-->

           <div class="parent2">
             <ul class="nav">
               <li><button>SUBS</button></li>
               <li><button id="liveKPIs" v-if="liveKPIs=='no'" @click="viewLiveKPIs">Live Stats</button> <button id="backToMatch" v-if="liveKPIs=='yes'" @click="viewLiveKPIs">Back to Match</button></li>
               <li><button  v-if="stopwatchStatus=='paused'" id="start" @click="timer">START</button><button v-if="stopwatchStatus=='going'" id="stop" @click="pause">PAUSE</button></li>
             <li><button id="clear" @click="clear">Clear Timer</button></li>
               <li><button id="finish" @click="finishMatch">Finish Match</button></li>
             </ul>
           </div>

            </div>
          </card>
        </div>
      </div>
    </div>
    {{ kpiListCollected}}
  </div>
</template>
<script>

  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import axios from "axios";
  import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
  import {VueTabs, VTab} from 'vue-nav-tabs'
  import 'vue-nav-tabs/themes/vue-tabs.css'
  import swal from 'sweetalert'

  export default {
    props: ['role', 'user', 'userID','selectedMatch','teamID', 'players', 'KPI_list' ,'teamExist','location','matchesDue', 'matchesComplete', 'team_name', 'team_type', 'awayTeams'],
    components: {
      Card,
      SweetModal,
      SweetModalTab,
      VueTabs,
      VTab
    },
    data: function() {
      return {
        homePlayas: [],
        team: '',
        items: [
          { region: '' },
          { region: 'Middle' },
          { region: this.team_name + ' Third' },
        ],
        playerKPITitles:[],
        active: '',
        squadmembers: [],
        selected: null,
        kpis: [],
        left:[],
        right: [],
        seconds:0,
        minutes:0,
        timeS: '00:00',
        stopwatchStatus:'paused',
        interval: 0,
        homeGoals:0,
        homePoints: 0,
        awayGoals:0,
        awayPoints: 0,
        opposition: '',
        collectedKPIs: [],
        show: false,
        kpiCollected:'',
        kpiCollectedID:'',
        timeCollected:'',
        playerCollected:'',
        playerCollectedID:'',
        playerNumber:'',
        locationCollected:'',
        teamCollectedID:'',
        kpiListCollected: [],
        subName: '',
        subID:'',
        subOFF:'',
        liveKPIs: 'no',
        homeCollected: [],
        awayCollected: [],
        stats: [],
        homePlayerStats: [],
        awayPlayerStats: [],
        divStats:[]
      }
    },
    mounted: function() {
      if (this.selectedMatch!=''){
        this.getMatch()
        this.getKPIs()
        this.getSquadMembers()
      }
      this.team=this.team_name
    },
    computed: {
      time() {
        if (this.seconds >= 60) {
          this.seconds = 0;
          this.minutes++;
        }
      },

    },
    methods: {
      getMatch(){
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
          this.opposition=this.match[0].opposition_name
          this.items[0].region= this.match[0].opposition_name + ' Third'
        }).catch(error => {
          console.log(error);
        });
      },
      getKPIs(){
        var teamUser = {
          "match_id": this.selectedMatch,
        }
        axios({
          url: 'https://matches-microservice.cfapps.io/getMatchKPIs',
          method: 'post',
          contentType: 'application/json',
          data: teamUser,
        }).then(result => {

          if (result.data.length != '0') {
            var results = []

            for (var i = 0; i < result.data.length; i++) {
              var matchkpi = {
                "kpi_id": result.data[i].kpi_id,
                "kpi_title": result.data[i].kpi_title,
              }
              results.push(matchkpi);
            }
            this.kpis = results

            var leftList=[]
            var rightList=[]

            for (var i = 0; i < Math.ceil(this.kpis.length/2); i++) {
              leftList.push(this.kpis[i])
            }
            this.left=leftList

            for (var i = Math.floor(this.kpis.length/2) ; i < this.kpis.length; i++) {
              rightList.push(this.kpis[i])
            }
            this.right=rightList
          }
          console.log(this.left)
        }).catch(error => {
          console.log(error);
        });
      },
      getSquadMembers(){
        var teamUser = {
          "matchevent_id": this.selectedMatch,
        }
        axios({
          url: 'https://matches-microservice.cfapps.io/getSquadMembers',
          method: 'post',
          contentType: 'application/json',
          data: teamUser,
        }).then(result => {

          if (result.data.length != '0') {
            var results = []

            for (var i = 0; i < result.data.length; i++) {
              var member = {
                "player_name": result.data[i].player_name,
                "position": result.data[i].position,
                "squad_number": result.data[i].squad_number,
                "player_id": result.data[i].player_id,
              }
              results.push(member);
            }
            this.squadmembers = results
          }
        }).catch(error => {
          console.log(error);
        });
      },
      add (){
        if (this.stopwatchStatus =='going') {
          this.seconds++;
          this.seconds = this.minTwoDigits(this.seconds)
          this.timer()

          if (this.minutes < 10) {
            this.minutes = ('0' + this.minutes).slice(-2)
          }

          if (this.seconds >= 60) {
            this.seconds = 0;
            this.minutes++;
            this.minutes = this.minTwoDigits(this.minutes)
          }

        }
      },
      selectKPI(x,y){
        this.kpiCollected=x;
        this.kpiCollectedID=y;
        var timeCollect = this.minutes + ':' + this.seconds
        this.timeCollected = timeCollect
        this.show = true
        this.$refs.mod.open()
      },
      select(x, y, z){

        if (y == this.playerCollected){
          document.getElementById(x).className = "circle";
          this.playerCollected = ''
          this.playerCollectedID = ''
        }
        else {
          this.playerCollected=y;
          this.playerCollectedID = z
          this.active=x;
          this.teamCollectedID= this.teamID

          var y = document.getElementById(x);
          var z = document.getElementsByClassName('circle');

          // this.className += " active";

          for (var i = 0; i < z.length; i++) {
            if (z[i].id == x){
              document.getElementById(z[i].id).className = "circle active";
            }
            else {
              document.getElementById(z[i].id).className = "circle";
            }
          }
        }
      },
      collectKPI(){

        if (this.team == this.team_name){
          this.teamCollectedID = this.match[0].teamHome_id
          var collected = {
            "kpi_title": this.kpiCollected,
            "kpi_id": this.kpiCollectedID,
            "time": this.minutes,
            "player": this.playerCollected,
            "player_id": this.playerCollectedID,
            "player_number": '',
            "pitchLocation": this.locationCollected,
            "team_id": this.teamCollectedID,
          }
        }

        if (this.team == this.opposition){
          this.teamCollectedID = this.match[0].teamAway_id

          var collected = {
            "kpi_title": this.kpiCollected,
            "kpi_id": this.kpiCollectedID,
            "time": this.minutes,
            "player": '',
            "player_id": '',
            "player_number": this.playerNumber,
            "pitchLocation": this.locationCollected,
            "team_id": this.teamCollectedID,
          }
        }

        this.kpiListCollected.push(collected)
        this.calculateScore()
        this.show=false;
        this.kpiCollected = ''
        this.kpiCollectedID=''
        this.timeCollected = ''
        this.playerCollected = ''
        this.teamCollectedID=''
        this.playerNumber=''
        this.team=this.team_name

        var z = document.getElementsByClassName('circle');


        for (var i = 0; i < z.length; i++) {
            document.getElementById(z[i].id).className = "circle";
        }
        this.$refs.mod.close()
      },
      closePop(){
        this.$refs.mod.close()
      },
      pause (){
        this.stopwatchStatus ='paused'
        this.interval=0
      },
      timer(){
        this.stopwatchStatus ='going'
        this.interval=1000
        var t = setTimeout(this.add, this.interval);
      },
      clear(){
        this.interval=0
        this.seconds=0
        this.minutes=0
      },
      minTwoDigits(n) {
        return (n < 10 ? '0' : '') + n;
      },
      makeSub(name, id) {
        this.subName=name
        this.subID=id
        this.$refs.swap.open()
      },
      confirmSub() {
        for (var i = 0; i < this.squadmembers.length; i++) {
          if ( this.squadmembers[i].player_name== this.subOFF){
            for (var x = 0; x < this.squadmembers.length; x++) {
              if ( this.squadmembers[x].player_name== this.subName){
                this.squadmembers[x].position = this.squadmembers[i].position
                this.squadmembers[i].position = 'SUB'
              }
            }
          }
        }
        this.$refs.swap.close()
      },
      calculateScore() {
        var i
          if ((this.kpiCollectedID == 4 || this.kpiCollectedID == 6) && this.teamCollectedID == this.match[0].teamHome_id) {
            this.homePoints++
          }
          if ((this.kpiCollectedID == 5 || this.kpiCollectedID == 7) && this.teamCollectedID == this.match[0].teamHome_id) {
            this.homeGoals++
          }
          if ((this.kpiCollectedID == 4 || this.kpiCollectedID == 6) && this.teamCollectedID == this.match[0].teamAway_id) {
            this.awayPoints++
          }
          if ((this.kpiCollectedID == 5 || this.kpiCollectedID == 7) && this.teamCollectedID == this.match[0].teamAway_id) {
            this.awayGoals++
          }
          else {
          }
      },
      changeTime(){
        if (this.stopwatchStatus =='paused') {
          this.$refs.time.open()
        }
      },
      closeTime(){
        this.$refs.time.close()
      },
      viewLiveKPIs(){
        if (this.liveKPIs=='yes') {
          this.liveKPIs = 'no'
        }
        else if (this.liveKPIs=='no') {
          this.liveKPIs = 'yes'
          this.calculateStats()
          this.playerStats()
        }
      },
      calculateStats(){
        var homeKPI = []
        var awayKPI = []
        for (var i = 0; i < this.kpiListCollected.length; i++) {

          var KPI = {
            "kpi_id": this.kpiListCollected[i].kpi_id,
            "kpi_title": this.kpiListCollected[i].kpi_title,
            "team_id": this.kpiListCollected[i].team_id,
            "quantity": 0
          }

          var KPIBlank = {
            "kpi_id": this.kpiListCollected[i].kpi_id,
            "kpi_title": this.kpiListCollected[i].kpi_title,
            "team_id": '',
            "quantity": 0
          }

          if (this.kpiListCollected[i].team_id == this.teamID) {
            homeKPI.push(KPI)
            KPIBlank.team_id= this.match[0].teamAway_id
            awayKPI.push(KPIBlank)
          }
          else {
            awayKPI.push(KPI)
            KPIBlank.team_id= this.teamID
            homeKPI.push(KPIBlank)
          }
        }
        this.loopHome(homeKPI)
        this.loopAway(awayKPI)

        var stats = []

        for (var x = 0; x < this.homeCollected.length; x++) {
          for (var i = 0; i < this.awayCollected.length; i++) {
            if (this.homeCollected[x].kpi_id == this.awayCollected[i].kpi_id) {

              var KPI = {
                "kpi_id": this.homeCollected[x].kpi_id,
                "title": this.homeCollected[x].kpi_title,
                "home": this.homeCollected[x].quantity,
                "away": this.awayCollected[i].quantity,
              }
              stats.push(KPI)
            }
          }
        }
        this.stats=stats;
        this.playerStats()
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
      loopHome(homeKPI){
        var i
        var x
        var common = []
        var zero = []
        for (x = 0; x < this.kpiListCollected.length; x++ ) {
          for (i = 0; i < homeKPI.length; i++) {
            if (this.kpiListCollected[x].kpi_id == homeKPI[i].kpi_id && this.kpiListCollected[x].team_id == homeKPI[i].team_id) {
              homeKPI[i].quantity++
            }
          }
        }

        for(x = 0; x < homeKPI.length; x++) {
          for (i = 0; i < homeKPI.length; i++) {
            if (homeKPI[x].kpi_id == homeKPI[i].kpi_id && homeKPI[x].quantity > homeKPI[i].quantity ) {
              // this.awayCollected[i]='';
              homeKPI.splice(i, 1);
            }
          }
        }

        var uniqueArrayZ = this.removeDuplicates(homeKPI, "kpi_id");

        this.homeCollected=uniqueArrayZ

      },
      loopAway(awayKPI){
        var i
        var x
        var common = []
        var zero = []
        for (x = 0; x < this.kpiListCollected.length; x++ ) {
          for (i = 0; i < awayKPI.length; i++) {
            if (this.kpiListCollected[x].kpi_id == awayKPI[i].kpi_id && this.kpiListCollected[x].team_id == awayKPI[i].team_id) {
              awayKPI[i].quantity++
            }
          }
        }

        for(x = 0; x < awayKPI.length; x++) {
          for (i = 0; i < awayKPI.length; i++) {
            if (awayKPI[x].kpi_id == awayKPI[i].kpi_id && awayKPI[x].quantity > awayKPI[i].quantity ) {
              awayKPI.splice(i, 1);
            }
          }
        }

        var uniqueArrayZ = this.removeDuplicates(awayKPI, "kpi_id");

        this.awayCollected=uniqueArrayZ


      },
      finishMatch (){
        swal({
          title: "Are you sure you want to finish the match?",
          text: "The match will be set as finished and you will be brought to the Match Review Section!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
          .then((willDelete) => {
            if (willDelete) {
              var kpis = []
              var i

              for (i = 0; i < this.kpiListCollected.length; i++) {
                var logkpi = {
                  "matchEvent_id": this.match[0].match_id,
                  "kpi_id": this.kpiListCollected[i].kpi_id,
                  "collected_pitch_location": this.kpiListCollected[i].pitchLocation,
                  "collected_time": this.kpiListCollected[i].time,
                  "team_id": this.kpiListCollected[i].team_id,
                  "player_id": this.kpiListCollected[i].player_id,
                  "player_number": this.kpiListCollected[i].player_number,
                }
                kpis.push(logkpi);
              }
              console.log(kpis)
              axios({
                url: 'https://matches-microservice.cfapps.io/finishmatch',
                method: 'post',
                contentType: 'application/json',
                data: kpis,
              }).then(result => {
                if (result.data.status == 'success') {
                  console.log('success')
                  this.sleep(2000)
                  this.$router.push({path: '/admin/matches/viewMatch'})
                  swal("Success! Your team has been saved!", {
                    icon: "success",
                  })
                } else {
                }
              }).catch(error => {
                console.log(error);
              });
            } else {
            }
          });
      },
      playerStats(){
        var homePlayers=[]
        var awayPlayers=[]
        for(var i =0; i < this.kpiListCollected.length; i++){
          if(this.kpiListCollected[i].player != '' && this.kpiListCollected[i].team_id == this.teamID) {
            var homeStat = {
              "player_name": this.kpiListCollected[i].player,
              "kpi_title": this.kpiListCollected[i].kpi_title,
              "team_id": this.kpiListCollected[i].team_id,
              "quantity": 0
            }
            homePlayers.push(homeStat)
          }
          if(this.kpiListCollected[i].player_number != '' && this.kpiListCollected[i].team_id == this.match[0].teamAway_id) {
            var awayStat = {
              "player_number": this.kpiListCollected[i].player_number,
              "kpi_title": this.kpiListCollected[i].kpi_title,
              "team_id": this.kpiListCollected[i].team_id,
              "quantity": 0
            }
            awayPlayers.push(awayStat)
          }
        }
        console.log(homePlayers)
        this.loopHomePlayers(homePlayers)
        this.loopAwayPlayers(awayPlayers)
      },
      loopHomePlayers(homeKPI){
        var i
        var x
        var common = []
        var zero = []
        for (x = 0; x < this.kpiListCollected.length; x++ ) {
          for (i = 0; i < homeKPI.length; i++) {
            if (this.kpiListCollected[x].kpi_title == homeKPI[i].kpi_title && this.kpiListCollected[x].player == homeKPI[i].player_name) {
              homeKPI[i].quantity++
            }
          }
        }

        // for(x = 0; x < homeKPI.length; x++) {
        //   for (i = 0; i < homeKPI.length; i++) {
        //     if (homeKPI[x].kpi_title == homeKPI[i].kpi_title && homeKPI[x].quantity > homeKPI[i].quantity ) {
        //       // this.awayCollected[i]='';
        //       homeKPI.splice(i, 1);
        //     }
        //   }
        // }

        var uniqueArrayZ = this.removeDuplicates(homeKPI, "player_name");

        this.homePlayerStats=uniqueArrayZ

        var uniqueArrayY=this.removeDuplicates(this.kpiListCollected, "kpi_title");
        this.playerKPITitles = uniqueArrayY

        console.log(this.homePlayerStats)
      },
      loopAwayPlayers(awayKPI){
        var i
        var x
        var common = []
        var zero = []
        for (x = 0; x < this.kpiListCollected.length; x++ ) {
          for (i = 0; i < awayKPI.length; i++) {
            if (this.kpiListCollected[x].kpi_title == awayKPI[i].kpi_title && this.kpiListCollected[x].team_id == awayKPI[i].team_id && this.kpiListCollected[x].player_number == awayKPI[i].player_number) {
              awayKPI[i].quantity++
            }
          }
        }

        // for(x = 0; x < awayKPI.length; x++) {
        //   for (i = 0; i < awayKPI.length; i++) {
        //     if (awayKPI[x].kpi_title == awayKPI[i].kpi_id && awayKPI[x].quantity > awayKPI[i].quantity ) {
        //       awayKPI.splice(i, 1);
        //     }
        //   }
        // }

        var uniqueArrayZ = this.removeDuplicates(awayKPI, "player_number");

        this.awayPlayerStats=uniqueArrayZ


      },
      playa(title, type){
        var results = ''
        var quantity = ''
        if( type == 'home') {
          for (var x = 0; x < this.homePlayerStats.length; x++) {
            if (this.homePlayerStats[x].kpi_title == title && this.homePlayerStats[x].player_name != '') {
              results += this.homePlayerStats[x].quantity + ' ' + this.homePlayerStats[x].player_name + '\n'
            }
          }
        }
          if( type == 'away'){
            for (var x = 0; x < this.awayPlayerStats.length; x++ ) {
              if (this.awayPlayerStats[x].kpi_title == title && this.awayPlayerStats[x].player_number != '') {
                results += this.awayPlayerStats[x].quantity + ' by Number ' + this.awayPlayerStats[x].player_number + '\n'
              }
            }
        }

        return results
      },
      sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
          if ((new Date().getTime() - start) > milliseconds) {
            break;
          }
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  @import '../../../assets/styles/app.scss';
  // include animation styles
  @import url('https://fonts.googleapis.com/css?family=Raleway:200');

  .matchevent {
    margin: auto;
    height: 100vh;
  }

  /*@media (max-width: 550px) {*/
    /*#pitch {*/
      /*margin: auto;*/
      /*width: 100%;*/
      /*border: 3px solid green;*/
      /*padding: 10px;*/
    /*}*/
    /*#pitchSVG {*/
      /*!*height: 700px;*!*/
      /*margin: auto;*/
      /*height: 380px;*/
      /*width: 280px;*/
    /*}*/
  /*}*/

  /* Small Screen */

  @media (max-width: 899px ) {
    #matchScreen {
      width: 100%;
      height: 100vh;
      margin: auto;
      display: flex;
      flex-direction: row;
    }

    #pitchSVG {
      height: 80%;
      width: 105%;
      margin: auto;
      /*float: right;*/
      /*margin-right: 1000px;*/
    }

    .circle {
      position: relative;
      display: inline-block;
      width: 33px;
      padding: 15px 0;
      line-height: 0;
      border-radius: 50%;
      background-color: black;
      color: white;
      text-align: center;
      font-size: .8em;
      border: 3px solid #40a0e0;
      cursor: pointer;
    }

    .circle i , .circleS i {
      color: white;
      clear: both;
      position: absolute;
      text-align: center;
      font-size: .8em;
      font-weight: 400;
      text-shadow:
        -1px -1px 0 #000,
        1px -1px 0 #000,
        -1px 1px 0 #000,
        1px 1px 0 #000;
      margin-top: 30px;
      margin-left: -50px;
      width: 100px;
    }

    .circle.active {
      background-color: yellow;
      color: black;
      width: 4%;
      padding: 2.5% 0;
    }

    #left {
      float: left;
      width: 20%;
      height: 100%;
      /*background-color: grey;*/
    }

    #right {
      float: right;
      width: 20%;
      /*margin-left: 50px;*/
    }

    #middle {
      height: 680px;
      width: 60%;
      /*margin:auto;*/
      /*background-color: yellow;*/
    }

    #pitch ul {
      list-style-type: none;
      width: 100%;
      padding-right: 5px;
      padding-left: 10px;
      height: 100%;
    }

    #pitch li {
      margin: auto;
      text-align: center;
      font-size: .8em;
      overflow: hidden;
      height: 7%;
      list-style: none;
      border-radius: 5px;
      line-height: 200%;
      font-weight: bold;
      background-color: #F0E68C;
      border-color: black;
      border-style: solid;
      border-width: thin;
      margin-bottom: 10px;
    }

    #GK {
      margin-top: -120px;
      margin-left: 26%;
      position: absolute;
    }

    #LCB {
      margin-top: -180px;
      margin-left: 13%;
      position: absolute;
    }

    #FB {
      margin-top: -180px;
      margin-left: 26%;
      position: absolute;
    }

    #RCB {
      margin-top: -180px;
      margin-left: 40%;
      position: absolute;
    }

    #LWB {
      margin-top: -240px;
      margin-left: 13%;
      position: absolute;
    }

    #CB {
      margin-top: -240px;
      margin-left: 26%;
      position: absolute;
    }

    #RWB {
      margin-top: -240px;
      margin-left: 40%;
      position: absolute;
    }

    #M1 {
      margin-top: -295px;
      margin-left: 20%;
      position: absolute;
    }

    #M2 {
      margin-top: -295px;
      margin-left: 32%;
      position: absolute;
    }

    #LWF {
      margin-top: -380px;
      margin-left: 13%;
      position: absolute;
    }

    #CF {
      margin-top: -380px;
      margin-left: 26%;
      position: absolute;
    }

    #RWF {
      margin-top: -380px;
      margin-left: 40%;
      position: absolute;
    }

    #LCF {
      margin-top: -450px;
      margin-left: 13%;
      position: absolute;
    }

    #FF {
      margin-top: -450px;
      margin-left: 26%;
      position: absolute;
    }

    #RCF {
      margin-top: -450px;
      margin-left: 40%;
      position: absolute;
    }

    .time {
      display: block;
      width: 100%;
      padding: 3px 0px 1px !important;
      background: #32342f;
      font-size: 2.3em;
      margin: auto;
    }

    .score {
      display: block;
      width: 100%;
      font-size: 2.2em;
      margin:auto;
      text-align: center;
    }

    .teams {
      font-family: 'Raleway', sans-serif;
      margin: auto;
      text-align: center;
      font-size: 1.6em;
      overflow: hidden;
      line-height: 100%;
    }
  }

  @media (min-width: 900px ) {

    #matchScreen {
      width: 100%;
      height: 100%;
      margin: auto;
      display: flex;
      flex-direction: row;
    }

    #left {
      /*float: right;*/
      width: 25%;
    }

    #right {
      /*float: left;*/
      width: 25%;
      /*margin-left: 50px;*/
    }

    #pitchSVG {
      height: 80%;
      width: 100%;
      margin: auto;

    }

    .circle {
      position: relative;
      display: inline-block;
      width: 40px;
      padding: 20px 0;
      line-height: 0;
      border-radius: 50%;
      background-color: black;
      color: white;
      text-align: center;
      font-size: .8em;
      border: 3px solid #40a0e0;
      cursor: pointer;
    }

    .circle i , .circleS i {
      color: white;
      clear: both;
      position: absolute;
      text-align: center;
      font-size: .9em;
      font-weight: 400;
      text-shadow:
        -1px -1px 0 #000,
        1px -1px 0 #000,
        -1px 1px 0 #000,
        1px 1px 0 #000;
      margin-top: 30px;
      margin-left: -50px;
      width: 100px;
    }

    .circle.active {
      background-color: yellow;
      color: black;
      width: 3.5%;
      padding: 5% 0;
    }

    #middle {
      /*background-color: blue;*/
      height: 680px;
      width: 50%;
      /*margin:auto;*/
    }

    #pitch ul {
      list-style-type: none;
      width: 100%;
      /*padding-right: 5px;*/
      /*padding-left: 10px;*/
      height: 100%;
    }

    #pitch li {
      width:200px;
      margin: auto;
      text-align: center;
      font-size: 1.3em;
      overflow: hidden;
      height: 10%;
      list-style: none;
      border-radius: 5px;
      line-height: 200%;
      font-weight: bold;
      background-color: #F0E68C;
      border-color: black;
      border-style: solid;
      border-width: thin;
      margin-bottom: 10px;
    }

    #GK {
      margin-top: -130px;
      margin-left: 260px;
      position: absolute;
    }

    #LCB {
      margin-top: -210px;
      margin-left: 120px;
      position: absolute;
    }

    #FB {
      margin-top: -210px;
      margin-left: 260px;
      position: absolute;
    }

    #RCB {
      margin-top: -210px;
      margin-left: 390px;
      position: absolute;
    }

    #LWB {
      margin-top: -290px;
      margin-left: 120px;
      position: absolute;
    }

    #CB {
      margin-top: -290px;
      margin-left: 260px;
      position: absolute;
    }

    #RWB {
      margin-top: -290px;
      margin-left: 390px;
      position: absolute;
    }

    #M1 {
      margin-top: -365px;
      margin-left: 200px;
      position: absolute;
    }

    #M2 {
      margin-top: -365px;
      margin-left: 310px;
      position: absolute;
    }

    #LWF {
      margin-top: -450px;
      margin-left: 120px;
      position: absolute;
    }

    #CF {
      margin-top: -450px;
      margin-left: 260px;
      position: absolute;
    }

    #RWF {
      margin-top: -450px;
      margin-left: 390px;
      position: absolute;
    }

    #LCF {
      margin-top: -550px;
      margin-left: 120px;
      position: absolute;
    }

    #FF {
      margin-top: -550px;
      margin-left: 260px;
      position: absolute;
    }

    #RCF {
      margin-top: -550px;
      margin-left: 390px;
      position: absolute;
    }

    .time {
      display: block;
      width: 100%;
      padding: 3px 0px 1px !important;
      background: #32342f;
      font-size: 2.5em;
    }

    .score {
      display: block;
      width: 100%;
      font-size: 2em;
      margin:auto;
      text-align: center;
    }

    .teams {
      font-family: 'Raleway', sans-serif;
      margin: auto;
      text-align: center;
      font-size: 2em;
      overflow: hidden;
      line-height: 100%;
    }
  }

    .frame {
      width: 100%;
      height: 100vh;
      margin: auto;
      border: 3px solid green;
      min-width: calc(200px);

    }

    #pitch {
      margin: auto;
      width: 100%;
      height: 100vh;
      /*display: flex;*/
      /*flex-direction: row;*/
      padding-top: 100px;
      padding-bottom: 100px;

    }

  .parent1 ul.nav {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    height: 5em;
    bottom: 0;
    width: 100%;
    text-align: center;
    background-color: white;
    margin-bottom:-80px;
    background: linear-gradient(-60deg, #46404f 53%, #4B4452 53%);
    box-shadow: 2px 3px 5px 0px rgba(0,0,0,0.25);
    font-family: Oxygen, sans-serif;
    color: white;
  }

  .parent1 ul.nav li {
    padding: 10px 15px;
    border-right: 1px solid black;
    width: 20%;
    height: 100%;
    text-align: center;
    line-height: 100%;
  }

  .parent1 ul.nav li:last-child {
    border: 0px;
  }

  .parent2 ul.nav {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    height: 5em;
    bottom: 0;
    width: 100%;
    text-align: center;
    margin-top: -75px;
    background: linear-gradient(-60deg, #46404f 53%, #4B4452 53%);
  }

  .parent2 ul.nav li {
    padding: 10px 15px;
    border-right: 1px solid black;
    width: 20%;
    height: 100%;
    text-align: center;
  }

  .parent2 ul.nav li:last-child {
    border: 0px;
  }

  li button{
    width:100%;
    height:100%;
    font-weight: 600;
    font-size: 2em;
  }

  #start {
    text-align: center;
    color: white;
    background: green;
    border:solid 2px #35492C;
    border-radius:5px;
    letter-spacing: .2em;
    cursor:pointer;
    font-size: .9em;
    width:100%;
    height:100%;
  }

  #stop {
    text-align: center;
    color: white;
    background: #721329;
    border:solid 2px #590F20;
    border-radius:5px;
    letter-spacing: .2em;
    cursor:pointer;
    font-size: .9em;
    width:100%;
    height:100%;
  }

  #clear {
    text-align: center;
    color: white;
    background: #564E58;
    border:solid 2px #3E383F;
    border-radius:5px;
    letter-spacing: .2em;
    cursor:pointer;
    font-size: 90%;
    width:100%;
    height:100%;
  }

  #finish {
    text-align: center;
    color: white;
    background: chocolate;
    border:solid 2px #3E383F;
    border-radius:5px;
    letter-spacing: .2em;
    cursor:pointer;
    font-size: 90%;
    width:100%;
    height:100%;
  }

  .popup {
    fill: blue;
    text-align: center;
  }

  .popup button {
    margin: auto;
    margin-top: 20px;
  }

  .popup select {
    width: 50%;
    margin: auto;
  }

  li:hover {
    color: red;
    background: blue;
    box-shadow: 0 4px #efa424;
    top: 2px;
    cursor: pointer;
  }

  th {
    background-color: rgba(29,150,178,1);
    color: white;
    margin-left: 200%;
    width: 50%;
  }

  td {
    font-size: 1.2em;
    width: 100%;
  }

  select {
    width: 100%;
    color: white;
  }

  #liveKPIs {
    text-align: center;
    color: black;
    border:solid 2px #3E383F;
    border-radius:5px;
    letter-spacing: .2em;
    cursor:pointer;
    font-size: 90%;
    width:100%;
    height:100%;
  }

  #backToMatch {
    text-align: center;
    color: black;
    border:solid 2px #3E383F;
    border-radius:5px;
    letter-spacing: .2em;
    cursor:pointer;
    font-size: 90%;
    width:100%;
    height:100%;
  }

  table {
    width:100%;
    overflow: hidden;
    height:10%;
  }

  .sweet{
    width: 100%;
  }

  .sweetTab{
    width: 100%;
  }

  .parent3 {
    margin-bottom: 5em;
  }

  .parent3 ul.nav {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    height: 5em;
    bottom: 0;
    width: 100%;
    text-align: center;
    margin-top: -50px;
    background: grey;
  }

  .parent3 ul.nav li {
    padding: 10px 15px;
    border-right: 1px solid black;
    width: 10%;
    height: 100%;
    text-align: center;
  }

  h2 {
    margin-top: -100px;
  }

  .circleS {
    position: relative;
    display: inline-block;
    width: 36%;
    padding: 16% 0;
    line-height: 0;
    border-radius: 50%;
    background-color: black;
    color: white;
    text-align: center;
    font-size: .8em;
    border: 3px solid #40a0e0;
    cursor: pointer;
  }

  #timeTable input {
    width: 20%;
  }

  .stats-table th {
    margin: auto;
    text-align: center;
    width: 50%;
  }

  .stats-table {
    margin: auto;
    width: 99%;
    text-align: center;
    clear: both;
  }

  .container-stats {
    width: 80%;
    margin:auto;
    font-size: 1.1em;
    /*overflow: hidden;*/
    /*height: 10%;*/
  }

  .homeST {
    float:left;
  }

  .awayST {
    float: right;
  }

  table {
    width: 85%;
    margin:auto;
    /*overflow-y: auto;*/
    /*overflow-x: hidden;*/
  }

  #events td {
    width: 85%;
    margin:auto;
  }

  #right, #left {
    margin-bottom: 20px;
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

  .playerKPI {
    width: 100%;
    line-height: 2;
  }

  #analysis {
    /*margin-left:50%;*/
    width: 100%;
  }

  .tab-container {
    /*background-color: yellow;*/
    height: 50%;
    overflow: hidden;
  }



</style>
