<template>
  <div class="matchevent">
    {{ kpiCollected }}

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
              <option v-for="row in items" :class=row :value="row.region" >{{ row.region }}</option>
            </select>
          </td>
        </tr>
        </tbody>
        <button type="button" @click="collectKPI" class="btn btn-success btn-lg">Save!</button>
      </table>
    </sweet-modal>

    <sweet-modal ref = 'swap' overlay-theme = "dark">

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

    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card>
         <div class="frame">
           <div class="parent1">
             <ul class="nav">
               <li class = "teams">{{ team_name}}</li>
               <li class = "score">{{homeGoals}} - {{homePoints}}</li>
               <li class = 'time'>{{ minutes }} : {{ seconds }}</li>
               <li class = "score">{{awayGoals}} - {{awayPoints}}</li>
               <li class = "teams">{{ opposition }}</li>
             </ul>
           </div>
            <div id="pitch">
                <div id="left">
                  <ul>
                    <li class="li" v-for="m in left" :id=m.kpi_title v-on:click.prevent='selectKPI(m.kpi_title,m.kpi_id)'>
                      <a>{{ m.kpi_title }}</a>
                    </li>
                  </ul>
                </div>
                <div id="middle">
                  <img id="pitchSVG" src="../../../../static/img/pitch.svg">
                  <div id="player">
                    <div v-for="positions in squadmembers" v-if="positions.position != 'SUB'">
                      <div class="circle" :id=positions.position v-on:click.prevent='select(positions.position, positions.player_name)' >
                        {{ positions.squad_number }}
                        <i>{{ positions.player_name }}</i>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="right">
                  <ul>
                    <li class="li" v-for="m in right" :id=m.kpi_title v-on:click.prevent='selectKPI(m.kpi_title,m.kpi_id)'>
                      {{ m.kpi_title }}
                    </li>
                  </ul>
              </div>
            </div>

           <div class = "parent3">
               <ul class="nav">
                 <li v-for="positions in squadmembers" v-if="positions.position == 'SUB'" v-on:click.prevent='makeSub(positions.player_name, positions.player_id, positions.position)'>
                   <div class="circleS" :id=positions.position>
                     {{ positions.squad_number }}
                     <i>{{ positions.player_name }}</i>
                   </div>
                 </li>
               </ul>
           </div>

           <div class="parent2">
             <ul class="nav">
               <li>Item 1</li>
               <li>Item</li>
               <li><button  v-if="stopwatchStatus=='paused'" id="start" @click="timer">START</button><button v-if="stopwatchStatus=='going'" id="stop" @click="pause">STOP</button></li>
             <li><button id="clear" @click="clear">Clear Timer</button></li>
               <li>Item 1</li>
             </ul>
           </div>

         </div>
          </card>
        </div>

        {{ kpiListCollected }}

      </div>
    </div>
  </div>
</template>
<script>

  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import axios from "axios";
  import Vodal from 'vodal';
  import { SweetModal, SweetModalTab } from 'sweet-modal-vue'

  export default {
    props: ['role', 'user', 'userID','selectedMatch','teamID', 'players', 'KPI_list' ,'teamExist','location','matchesDue', 'matchesComplete', 'team_name', 'team_type', 'awayTeams'],
    components: {
      Card,
      Vodal,
      SweetModal,
      SweetModalTab,
    },
    data: function() {
      return {
        team: '',
        items: [
          { region: 'Opponents Third' },
          { region: 'Middle' },
          { region: 'Own Third' },
        ],
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
        subOFF:''
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
          url: 'http://localhost:4000/getMatch',
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
        }).catch(error => {
          console.log(error);
        });
      },
      getKPIs(){
        var teamUser = {
          "match_id": this.selectedMatch,
        }
        axios({
          url: 'http://localhost:4000/getMatchKPIs',
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
            console.log(results)
            this.kpis = results

            var leftList=[]
            var rightList=[]

            for (var i = 0; i < this.kpis.length/2; i++) {
              leftList.push(this.kpis[i])
            }
            this.left=leftList

            for (var i = this.kpis.length/2; i < this.kpis.length; i++) {
              rightList.push(this.kpis[i])
            }
            this.right=rightList
          }
        }).catch(error => {
          console.log(error);
        });
      },
      getSquadMembers(){
        var teamUser = {
          "matchevent_id": this.selectedMatch,
        }
        axios({
          url: 'http://localhost:4000/getSquadMembers',
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
            console.log(results)
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
        }

        if (this.team == this.opposition){
          this.teamCollectedID = this.match[0].teamAway_id
        }

        var collected = {
          "kpi_title": this.kpiCollected,
          "kpi_id": this.kpiCollectedID,
          "time": this.timeCollected,
          "player": this.playerCollected,
          "player_id": this.playerCollectedID,
          "player_number": this.playerNumber,
          "pitchLocation": this.locationCollected,
          "team_id": this.teamCollectedID,
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
          if ((this.kpiCollectedID == 3 || this.kpiCollectedID == 5) && this.teamCollectedID == this.match[0].teamHome_id) {
            this.homePoints++
          }
          if ((this.kpiCollectedID == 4 || this.kpiCollectedID == 6) && this.teamCollectedID == this.match[0].teamHome_id) {
            this.homeGoals++
          }
          if ((this.kpiCollectedID == 3 || this.kpiCollectedID == 5) && this.teamCollectedID == this.match[0].teamAway_id) {
            this.awayPoints++
          }
          if ((this.kpiCollectedID == 4 || this.kpiCollectedID == 6) && this.teamCollectedID == this.match[0].teamAway_id) {
            this.awayGoals++
          }
          else {
          }
      },
    }
  }
</script>
<style scoped lang="scss">
  @import '../../../assets/styles/app.scss';
  // include animation styles
  @import "../../../../node_modules/vodal/common.css";
  @import "../../../../node_modules/vodal/rotate.css";
  @import url('https://fonts.googleapis.com/css?family=Raleway:200');

  .matchevent {
    margin: auto;
  }

  @media (max-width: 550px) {
    #pitch {
      margin: auto;
      width: 100%;
      border: 3px solid green;
      padding: 10px;
    }
    #pitchSVG {
      /*height: 700px;*/
      width: 100%;
      margin: auto;
    }
  }

  @media (min-width: 550px ) {

    .frame {
      width: 90%;
      height: 100%;
      margin: auto;
      border: 3px solid green;
    }
    #pitch {
      margin: auto;
      width: 80%;
      height:900px;
      display: flex;
      flex-direction: row;
      overflow: hidden;
      padding-top: 100px;
      padding-bottom: 100px;
    }
    #pitchSVG {
      height: 680px;
      width: 480px;
      margin: auto;
      margin-right: 100px
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
      font-size: 1.3em;
      overflow: hidden;
      height: 10%;
      list-style: none;
      border-radius: 5px;
      line-height: 100%;
      font-weight: bold;
      background-color: #F0E68C;
      border-color: black;
      border-style: solid;
      border-width: thin;
      margin-bottom: 10px;
    }

    #left {
      float: left;
      width: 20%;
      /*background-color: grey;*/
    }

    #right {
      float: right;
      width: 20%;
      /*background-color: yellow;*/
      /*margin-left: 50px;*/
    }

    #middle {
      /*background-color: blue;*/
      height: 680px;
      width: 480px;
    }
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
    margin-top: -50px;
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

  .circle {
    position: relative;
    display: inline-block;
    width: 3%;
    padding: 1.5% 0;
    line-height: 0;
    border-radius: 50%;
    background-color: black;
    color: white;
    text-align: center;
    font-size: .8em;
    border: 3px solid #40a0e0;
    cursor: pointer;
  }

  #GK {
    margin-top: -130px;
    margin-left: 220px;
    position: absolute;
  }

  #LCB {
    margin-top: -210px;
    margin-left: 100px;
    position: absolute;
  }

  #FB {
    margin-top: -210px;
    margin-left: 220px;
    position: absolute;
  }

  #RCB {
    margin-top: -210px;
    margin-left: 350px;
    position: absolute;
  }

  #LWB {
    margin-top: -290px;
    margin-left: 100px;
    position: absolute;
  }

  #CB {
    margin-top: -290px;
    margin-left: 220px;
    position: absolute;
  }

  #RWB {
    margin-top: -290px;
    margin-left: 350px;
    position: absolute;
  }

  #M1 {
    margin-top: -365px;
    margin-left: 190px;
    position: absolute;
  }

  #M2 {
    margin-top: -365px;
    margin-left: 260px;
    position: absolute;
  }

  #LWF {
    margin-top: -450px;
    margin-left: 100px;
    position: absolute;
  }

  #CF {
    margin-top: -450px;
    margin-left: 220px;
    position: absolute;
  }

  #RWF {
    margin-top: -450px;
    margin-left: 350px;
    position: absolute;
  }

  #LCF {
    margin-top: -550px;
    margin-left: 100px;
    position: absolute;
  }

  #FF {
    margin-top: -550px;
    margin-left: 220px;
    position: absolute;
  }

  #RCF {
    margin-top: -550px;
    margin-left: 350px;
    position: absolute;
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

  .circle.active {
    background-color: yellow;
    color: black;
    width: 3.5%;
    padding: 2% 0;
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

  .time {
    display: block;
    width: 100%;
    padding: 3px 0px 1px !important;
    background: #32342f;
    font-size: 3em;
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

  table {
    width:100%;
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

  .parent3 ul.nav li:last-child {
    border: 0px;
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


</style>
