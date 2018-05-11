<template>
  <div id="preevent">
    <form-wizard @on-complete="saveSquad" color="#40a0e0" >
      <h2 slot="title">Pre Match Setup</h2>
      <tab-content title="KPI Selection" class = "stepOneContainer1">
        <h2> Choose your KPI's to collect </h2>
        <h3> You can choose 16 KPI's to collect during a match</h3>
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <card>

                <div class = "stepOneContainer">
                  <card id = "KPI1">
                    <template slot="header">
                      <h3 class="card-title">Available</h3>
                      <div id = "editButton">
                      </div>
                    </template>
                    <table class="table is-striped is-bordered is-narrow">
                        <tbody v-for="KPI in kpis">
                        <td>{{KPI.KPI_title}} <button @click="moveToSelected(KPI.KPI_title,KPI.KPI_id)"><i class="glyphicon glyphicon-arrow-right"></i></button> </td>
                        </tbody>
                    </table>
                  </card>
                    <card id = "KPI2">
                      <template slot="header">
                        <h3 class="card-title">Selected KPI's {{ selectedKPIs.length }}</h3>
                      </template>
                    <table class="table is-striped is-bordered is-narrow">
                      <tbody v-for="selected in selectedKPIs">
                        <td><button @click="moveFromSelected(selected.KPI_title)"><i class="glyphicon glyphicon-arrow-left"></i></button> {{selected.KPI_title}} </td>
                        </tbody>
                    </table>
                  </card>
                </div>
              </card>
            </div>
          </div>
        </div>
      </tab-content>
      <tab-content title="Squad Numbers">
        <h2> Choose Squad Numbers </h2>
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">

              <card>
                <div class="dragArea">
                  <card class = "drag1">
                    <template slot="header">
                      <h3 class="card-title">Players</h3>
                    </template>
                    <table class="table is-striped is-bordered is-narrow">
                    <draggable v-model="playersList" :options="{group:'people'}">
                      <tbody v-for="element in playersList">
                      <td>{{element.name}}</td>
                      </tbody>
                    </draggable>
                    </table>
                  </card>

                  <card class = "drag2">
                    <template slot="header">
                      <h3 class="card-title">Squad Numbers</h3>
                    </template>
                    <table class="table is-striped is-bordered is-narrow">
                    <draggable v-model="rows" v-on:change="onDrag" :options="{group:'people'}">
                      <tbody v-for="element in rows">
                      <td>{{element.snumber}} {{ element.name }}</td>
                      </tbody>
                    </draggable>
                    </table>

                </card>
                </div>
              </card>
            </div>
          </div>
        </div>
      </tab-content>
      <!--:before-change="validateSquad"-->
      <tab-content title="Player Positions" :before-change="assignSubs">
        <div class = "stepThreeContainer">
          <div id="pitch">
            <img id="pitchSVG" src="../../../../static/img/pitch.svg">
            <div v-for="positions in squadList" v-if="positions.key != 'SUB'">
              <div class="circle" :id=positions.key>
                {{ positions.jerseyIcon }}
              </div>
            </div>
          </div>
          <div class="squad2">
            <div v-if="errorMsg">
              <span class="error">{{errorMsg}}</span>
            </div>
            <table class="table is-striped is-bordered is-narrow">
              <tr>
                <td><strong> Goalkeeper </strong></td>
                <td><select v-model="squadList[0].number" class="form-control" @change="clear" >
                  <option id="null"></option>
                  <option v-for="row in rows2" :class="'number' + row.snumber" :value="row.snumber" >{{ row.snumber }} {{ row.name }}</option>
                </select></td>
              </tr>
              <tr>
                <td><strong> Right Corner Back </strong></td>
                <td><select v-model="squadList[1].number" class="form-control" @change="clear">
                  <option id="null"></option>
                  <option v-for="row in rows2" :class="'number' + row.snumber" :value="row.snumber" >{{ row.snumber }} {{ row.name }}</option>
                </select></td>
              </tr>
              <tr>
                <td><strong> Left Corner Back </strong></td>
                <td><select v-model="squadList[2].number" class="form-control" @change="clear">
                  <option id="null"></option>
                  <option v-for="row in rows2" :class="'number' + row.snumber" :value="row.snumber" >{{ row.snumber }} {{ row.name }}</option>
                </select></td>
              </tr>
              <tr>
                <td><strong> Full Back </strong></td>
                <td><select v-model="squadList[3].number" class="form-control" @change="clear">
                  <option id="null"></option>
                  <option v-for="row in rows2" :class="'number' + row.snumber" :value="row.snumber" >{{ row.snumber }} {{ row.name }}</option>
                </select></td>
              </tr>
              <tr>
                <td><strong> Right Wing Back </strong></td>
                <td><select v-model="squadList[4].number" class="form-control" @change="clear">
                  <option id="null"></option>
                  <option v-for="row in rows2" :class="'number' + row.snumber" :value="row.snumber" >{{ row.snumber }} {{ row.name }}</option>
                </select></td>
              </tr>
              <tr>
                <td><strong> Left Wing Back </strong></td>
                <td><select v-model="squadList[5].number" class="form-control" @change="clear">
                  <option id="null"></option>
                  <option v-for="row in rows2" :class="'number' + row.snumber" :value="row.snumber" >{{ row.snumber }} {{ row.name }}</option>
                </select></td>
              </tr>
              <tr>
                <td><strong> Centre Back </strong></td>
                <td><select v-model="squadList[6].number" class="form-control" @change="clear">
                  <option id="null"></option>
                  <option v-for="row in rows2" :class="'number' + row.snumber" :value="row.snumber" >{{ row.snumber }} {{ row.name }}</option>
                </select></td>
              </tr>
              <tr>
                <td><strong> Midfield </strong></td>
                <td><select v-model="squadList[7].number" class="form-control" @change="clear">
                  <option id="null"></option>
                  <option v-for="row in rows2" :class="'number' + row.snumber" :value="row.snumber" >{{ row.snumber }} {{ row.name }}</option>
                </select></td>
              </tr>
              <tr>
                <td><strong> Midfield </strong></td>
                <td><select v-model="squadList[8].number" class="form-control" @change="clear">
                  <option id="null"></option>
                  <option v-for="row in rows2" :class="'number' + row.snumber" :value="row.snumber" >{{ row.snumber }} {{ row.name }}</option>
                </select></td>
              </tr>
              <tr>
                <td><strong> Right Wing Forward </strong></td>
                <td><select v-model="squadList[9].number" class="form-control" @change="clear">
                  <option id="null"></option>
                  <option v-for="row in rows2" :class="'number' + row.snumber" :value="row.snumber" >{{ row.snumber }} {{ row.name }}</option>
                </select></td>
              </tr>
              <tr>
                <td><strong> Left Wing Forward </strong></td>
                <td><select v-model="squadList[10].number" class="form-control" @change="clear">
                  <option id="null"></option>
                  <option v-for="row in rows2" :class="'number' + row.snumber" :value="row.snumber" >{{ row.snumber }} {{ row.name }}</option>
                </select></td>
              </tr>
              <tr>
                <td><strong> Center Forward </strong></td>
                <td><select v-model="squadList[11].number" class="form-control" @change="clear">
                  <option id="null"></option>
                  <option v-for="row in rows2" :class="'number' + row.snumber" :value="row.snumber" >{{ row.snumber }} {{ row.name }}</option>
                </select></td>
              </tr>
              <tr>
                <td><strong> Right Corner Forward </strong></td>
                <td><select v-model="squadList[12].number" class="form-control" @change="clear">
                  <option id="null"></option>
                  <option v-for="row in rows2" :class="'number' + row.snumber" :value="row.snumber" >{{ row.snumber }} {{ row.name }}</option>
                </select></td>
              </tr>
              <tr>
                <td><strong> Full Forward </strong></td>
                <td><select v-model="squadList[13].number" class="form-control" @change="clear">
                  <option id="null"></option>
                  <option v-for="row in rows2" :class="'number' + row.snumber" :value="row.snumber" >{{ row.snumber }} {{ row.name }}</option>
                </select></td>
              </tr>
              <tr>
                <td><strong> Left Corner Forward </strong></td>
                <td><select v-model="squadList[14].number" class="form-control" @change="clear">
                  <option id="null"></option>
                  <option v-for="row in rows2" :class="'number' + row.snumber" :value="row.snumber" >{{ row.snumber }} {{ row.name }}</option>
                </select></td>
              </tr>
            </table>
          </div>
        </div>
      </tab-content>

      <tab-content title="Overview" >
        <card>
          <template slot="header">
          <table class="table" id="overview">
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
            </tbody>
          </table>
          </template>

          <table class="table">
            <thead>
            <tr>
              <th scope="col">Position</th>
              <th scope="col">Squad Number</th>
              <th scope="col">Player</th>
              <th scope="col"></th>

            </tr>
            </thead>
            <tbody>
            <tr v-for="row in squadList">
              <td class = "match">{{ row.position }}</td>
              <td class = "match">{{ row.number }}</td>
              <td class = "match">{{ row.name }}</td>
              <td class = "match"></td>
            </tr>
            </tbody>
          </table>

        </card>

      </tab-content>
    </form-wizard>

  </div>

</template>

<script>

  import draggable from 'vuedraggable'
  import axios from "axios";
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import {FormWizard, TabContent} from 'vue-form-wizard'
  import 'vue-form-wizard/dist/vue-form-wizard.min.css'


  export default {
    props: ['role', 'user','players', 'userID','selectedMatch','teamID', 'players', 'KPI_list' ,'teamExist','location','matchesDue', 'matchesComplete', 'team_name', 'team_type', 'awayTeams'],
    components: {
      Card,
      draggable,
      FormWizard,
      TabContent,
    },
    data() {
      return {
        kpi_titles: [],
        errorMsg: null,
        selectedKPIs:[],
        kpis: [],
        match: [],
        opposition: '',
        squadSize: '',
        rows: [],
        rows2: [],
        playersList:[],
        selected: [],
        squadList: [{
          jerseyIcon:'GK',
          position: "Goalkeeper",
          key: "GK",
          number: '',
          name: '',
          playerID: '',
        }, {
          jerseyIcon:'RCB',
          position: "Right Corner Back",
          key: "RCB",
          number: '',
          name: '',
          playerID: '',
        }, {
          jerseyIcon:'FB',
          position: "Full Back",
          key: "FB",
          number: '',
          name: '',
          playerID: '',
        },{
          jerseyIcon: 'LCB',
          position: "Left Corner Back",
          key: "LCB",
          number: '',
          name: '',
          playerID: '',
        },{
          jerseyIcon:'RWB',
          position: "Right Wing Back",
          key: "RWB",
          number: '',
          name: '',
          playerID: '',
        },{
          jerseyIcon:'CB',
          position: "Centre Back",
          key: "CB",
          number: '',
          name: '',
          playerID: '',
        },{
          jerseyIcon:'LWB',
          position: "Left Wing Back",
          key: "LWB",
          number: '',
          name: '',
          playerID: '',
        },{
          jerseyIcon:'M',
          position: "Midfield",
          key: "M1",
          number: '',
          name: '',
          playerID: '',
        },{
          jerseyIcon:'M',
          position: "Midfield",
          key: "M2",
          number: '',
          name: '',
          playerID: '',
        },{
          jerseyIcon:'RWF',
          position: "Right Wing Forward",
          key: "RWF",
          number: '',
          name: '',
          playerID: '',
        },{
          jerseyIcon:'CF',
          position: "Centre Forward",
          key: "CF",
          number: '',
          name: '',
          playerID: '',
        },{
          jerseyIcon:'LWF',
          position: "Left Wing Forward",
          key: "LWF",
          number: '',
          name: '',
          playerID: '',
        },{
          jerseyIcon:'RCF',
          position: "Right Corner Forward",
          key: "RCF",
          number: '',
          name: '',
          playerID: '',
        },{
          jerseyIcon:'FF',
          position: "Full Forward",
          key: "FF",
          number: '',
          name: '',
          playerID: '',
        },{
          jerseyIcon:'LCF',
          position: "Left Corner Forward",
          key: "LCF",
          number: '',
          name: '',
          playerID: '',
        }
        ],
        jerseyStore: [{
          jerseyIcon:'GK',
        }, {
          jerseyIcon:'RCB',
        }, {
          jerseyIcon:'FB',
        },{
          jerseyIcon: 'LCB',
        },{
          jerseyIcon:'RWB',
        },{
          jerseyIcon:'CB',
        },{
          jerseyIcon:'LWB',
        },{
          jerseyIcon:'M',
        },{
          jerseyIcon:'M',
        },{
          jerseyIcon:'RWF',
        },{
          jerseyIcon:'CF',
        },{
          jerseyIcon:'LWF',
        },{
          jerseyIcon:'RCF',
        },{
          jerseyIcon:'FF',
        },{
          jerseyIcon:'LCF',
        }
        ],
      }
    },
    mounted() {
        this.getMatch()
        this.kpis = this.KPI_list

        var x
        for (x = 0; x < this.players.length; x++) {
        var player = {
          "snumber": '',
          "playerID": this.players[x].playerID,
          "name": this.players[x].firstName + ' ' + this.players[x].lastName,
          }
        this.playersList.push(player)
        }

        var i
        for (i = 1; i < this.players.length +1; i++) {
          var playersTemp = {
            "snumber": i,
            "playerID": '',
            "name": '',
          }
          this.rows.push(playersTemp)
        }
    },
    methods: {
      moveToSelected(name, id){
        var KPI = {
          "KPI_title": name,
          "KPI_id": id,
        }
        this.selectedKPIs.push(KPI)

        for (var i = 0; i < this.kpis.length; i++) {
          for (var n = 0; n < this.selectedKPIs.length; n++) {
            if ( this.selectedKPIs[n].KPI_title == this.kpis[i].KPI_title){
              this.kpis.splice(i,1)
            }
          }
        }
      },
      moveFromSelected(name,id){
        var KPI = {
          "KPI_title": name,
          "KPI_id": id,
        }
        this.kpis.push(KPI)

        for (var i = 0; i < this.kpis.length; i++) {
          for (var n = 0; n < this.selectedKPIs.length; n++) {
            if ( this.selectedKPIs[n].KPI_title == this.kpis[i].KPI_title){
              this.selectedKPIs.splice(n,1)
            }
          }
        }
      },
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
        }).catch(error => {
          console.log(error);
        });
      },
      onDrag(){
        var i
        var r = []
        r = this.rows
        var list = []
        var list2 = []
        console.log('onDrag' + r)
        for (i = 0; i < r.length; i++) {
          if (r[i].name == '') {
            var playersTemp = {
              "jerseyIcon":i+1,
              "snumber": i+1,
              "playerID": '',
              "name": '',
              "position": "Sub",
              "key": "",
            }
          }
          else {
            var playersTemp = {
              "jerseyIcon":i+1,
              "snumber": i+1,
              "playerID": this.rows[i].playerID,
              "name": this.rows[i].name,
              "position": "Sub",
              "key": "",
            }
          }
          if(playersTemp.playerID!=''){
            list2.push(playersTemp)
          }
          list.push(playersTemp)
        }
        this.rows = []
        this.rows = list
        this.rows2 = []
        this.rows2= list2

        var n
        for (n = this.players.length; n <= this.rows.length; n++) {
          if (this.rows[n].name == ''){
            this.rows.splice(n, 1);
          }
        }
      },
      clear(e){
        for (var n = 0; n < this.rows.length;n++) {
          if (this.rows[n].name == '') {
            this.rows[n].position = ''
          }
          else{
            this.rows[n].position = 'Sub'
          }
        }
        this.onSelect(e)
      },
      onSelect: function(e){
        var m
        var n
        console.log(e.target.value)
        for (m = 0; m < this.squadList.length; m++) {
          if (this.squadList[m].number == '' && this.squadList[m].name != '') {
            for (n = 0; n < this.rows.length; n++) {
              if (this.squadList[m].name == this.rows[n].name) {
                var sin = this.rows[n].snumber
                var cells2 = document.getElementsByClassName('number' + sin);

                for (var i = 0; i < cells2.length; i++) {
                  cells2[i].disabled = false;
                }
              }
            }
          }
        }
        for (m = 0; m < this.squadList.length; m++) {
          for (n = 0; n < this.squadList.length; n++) {
            if (this.squadList[m].name == this.squadList[n].name && this.squadList[n].position == 'Sub') {
              this.squadList.splice(n, 1)
              console.log('Removed Sub')
            }
          }
        }

        for (m = 0; m < this.squadList.length; m++) {
          for (n = 0; n < this.rows.length;n++) {

            if (this.squadList[m].number == this.rows[n].snumber) {
              this.squadList[m].name = this.rows[n].name
              this.squadList[m].playerID = this.rows[n].playerID
              this.squadList[m].jerseyIcon = this.rows[n].jerseyIcon
              this.rows[n].position = this.squadList[m].position
              console.log(this.squadList[m].position)

              var cells = document.getElementsByClassName('number' + e.target.value);
              for (var i = 0; i < cells.length; i++) {
                cells[i].disabled = true;
              }
            }
            if (this.squadList[m].number == '' && this.squadList[m].name != '') {
              this.squadList[m].name = ''
              this.squadList[m].jerseyIcon = this.jerseyStore[m].jerseyIcon
            }

            if (this.squadList[m].name == this.rows[n].name && this.rows[n].name != '' ) {
              this.rows[n].position = this.squadList[m].position
              console.log('hi' + this.squadList[m].position)
            }
          }
        }
      },
      assignSubs () {
        for (var m = 0; m < this.rows.length; m++) {
          if (this.rows[m].position == 'Sub' && this.rows[m].name != '') {
            var member = {
              "jerseyIcon": 'SUB',
              "position": "Sub",
              "key": "SUB",
              "number": this.rows[m].snumber,
              "name": this.rows[m].name,
              "playerID": this.rows[m].playerID,
            }
              this.squadList.push(member)
          }

          for (var n = 0; n < this.squadList.length;n++){

            if (this.rows[m].name == this.squadList[n].name && this.squadList[n].position == 'Sub' && this.rows[m].position != '' && this.rows[m].position != 'Sub') {
              this.squadList.splice(n, 1)
            }

            var count =0
            for (var l = 0; l < this.squadList.length;l++){
              if (this.squadList[n].name == this.squadList[l].name && this.squadList[n].position == 'Sub' && this.squadList[l].position == 'Sub'){
                count++
                if (count>1) {
                  this.squadList.splice(n, 1)
                  console.log('match' + this.squadList[n])
                }
              }
            }
          }
        }
        return true
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
      validateSquad:function() {
        return new Promise((resolve, reject) => {
          var count = 0
          for (var n = 0; n < this.squadList.length;n++) {
            if (this.squadList[n].name == '') {
              count++
            } else {
            }
          }
            if (count > 0){
              this.errorMsg='Please select all positions'
              reject('This is a custom validation error message. Click next again to get rid of the validation')
            }
            else{
              console.log('validate' + count)
              resolve(true)
            }})
      },
      saveSquad () {
        var logMatch = {
          "matchevent_id": this.selectedMatch,
        }
        axios({
          url: 'https://matches-microservice.cfapps.io/createMatchdaySquad',
          method: 'post',
          contentType: 'application/json',
          data: logMatch,
        }).then(result => {
          if (result.data.status == 'success') {
            console.log("Squad created" + result.data.matchdaySquad_id)
            var squadMembers = []
            var i

            for (i = 0; i < this.squadList.length; i++) {

              var logPlayers = {
                "position": this.squadList[i].key,
                "squadNumber": this.squadList[i].number,
                "squadID": result.data.matchdaySquad_id,
                "playerID": this.squadList[i].playerID,
                "name": this.squadList[i].name,

              }
              squadMembers.push(logPlayers);
            }
            axios({
              url: 'https://matches-microservice.cfapps.io/createSquadMember',
              method: 'post',
              contentType: 'application/json',
              data: squadMembers,
            }).then(result => {
              if (result.data.status == 'success') {
                console.log("Squad members created")
              }
            }).catch(error => {
              console.log(error);
            });
            this.saveKPIList()
          }
        }).catch(error => {
          console.log(error);
        });
      },
      saveKPIList(){
        var kpiList =[]
        for (var i = 0; i < this.selectedKPIs.length; i++) {

          var kpi = {
            "match_id": this.match[0].match_id,
            "KPI_id": this.selectedKPIs[i].KPI_id,
            "KPI_title": this.selectedKPIs[i].KPI_title,
          }
          kpiList.push(kpi);
        }
        console.log(kpiList)
        axios({
          url: 'https://matches-microservice.cfapps.io/saveMatchKPIs',
          method: 'post',
          contentType: 'application/json',
          data: kpiList,
        }).then(result => {
          if (result.data.status == 'success') {
            console.log("KPIs saved")
          }
        }).catch(error => {
          console.log(error);
        });
      },
    },
  }
</script>
<style scoped lang="scss">
  @import '../../../assets/styles/app.scss';

  #preevent{
    width: 80%;
    margin:auto;
    height: 100%;
  }
  .stepOneContainer1 {
    text-align: center;
  }
  .stepOneContainer {
    display: flex;
    flex-direction: row;
    text-align: center;
  }
  .stepThreeContainer {
    display: flex;
    flex-direction: row;
  }

  #pitch {
    height: 600px;
    width: 400px;
    position: relative;
    margin-right: 80px;
  }

  #pitchSVG {
    height: 600px;
    width: 400px;
  }

  .circle {
    position: relative;
    display: inline-block;
    width: 8%;
    padding: 4% 0;
    line-height: 0;
    border-radius: 50%;
    background-color: black;
    color: white;
    text-align: center;
    font-size: .8em;
    border: 3px solid #40a0e0;
    cursor: pointer;
  }

  .circle h3 {
    margin-top: 10px;
  }

  .drag1 {
    width: 50%;
    float: left;
    line-height: 30px;
  }

  .drag2 {
    width: 50%;
    float: right;
    line-height: 30px;
  }

  .dragArea {
    min-height: 100px;
    font-size: 1.2em;
  }

  .squad2 {
    width: 50%;
    float:right;
      }

  #GK {
    margin-top: -100px;
    margin-left: 185px;
    position: absolute;
  }

  #LCB {
    margin-top: -170px;
    margin-left: 80px;
    position: absolute;
  }

  #FB {
    margin-top: -170px;
    margin-left: 185px;
    position: absolute;
  }

  #RCB {
    margin-top: -170px;
    margin-left: 300px;
    position: absolute;
  }

  #LWB {
    margin-top: -250px;
    margin-left: 80px;
    position: absolute;
  }

  #CB {
    margin-top: -250px;
    margin-left: 185px;
    position: absolute;
  }

  #RWB {
    margin-top: -250px;
    margin-left: 300px;
    position: absolute;
  }

  #M1 {
    margin-top: -315px;
    margin-left: 160px;
    position: absolute;
  }

  #M2 {
    margin-top: -315px;
    margin-left: 220px;
    position: absolute;
  }

  #LWF {
    margin-top: -400px;
    margin-left: 80px;
    position: absolute;
  }

  #CF {
    margin-top: -400px;
    margin-left: 185px;
    position: absolute;
  }

  #RWF {
    margin-top: -400px;
    margin-left: 300px;
    position: absolute;
  }

  #LCF {
    margin-top: -490px;
    margin-left: 80px;
    position: absolute;
  }

  #FF {
    margin-top: -490px;
    margin-left: 185px;
    position: absolute;
  }

  #RCF {
    margin-top: -490px;
    margin-left: 300px;
    position: absolute;
  }

  #circleP
  {
    color: white;
  }

  #KPI1, #KPI2 {
    width: 50%;
    font-size: 1.2em;
  }

  .stepOneContainer table  {
    position: relative;
    width: 100%;
    text-align: center;
  }

  td {
    width: 20%;
  }

  #KPI1 button {
    float: right;
  }

  #KPI2 button {
    float: left;
  }

  #overview th {
    background-color: rgba(29,150,178,1);
    color: white;
    width: 20%;
    margin-left: 200%;
  }

  #overview td {
    font-size: 1.2em;
  }

</style>
