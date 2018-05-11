<template>
  <div class="manage">

      <div class="header">
        <h1> {{ team_name }} </h1>
        <h3> {{ location }} </h3>
      </div>
        <hr>

    <div class="container-fluid">
      <div class="row" v-if="teamExist != 'no'">
        <div class="col-6">
          <card>
            <template slot="header">
              <h3 class="card-title">Players</h3>
              <div id = "editButton">
              <button type="button" class="btn btn-info" @click.prevent="relocate_editPlayers" >Edit</button>
              </div>
            </template>
            <div id = "playersTable">
              <table v-if="players.length !=0" class="table is-striped is-bordered is-narrow">
                <tbody v-for="player in players">
                <td> {{ player.firstName}} {{ player.lastName}}</td>
                </tbody>
              </table>
            </div>
            <div class="row" v-if="players.length ==0" >
              <button type="button" class="btn btn-success btn-lg" @click.prevent="relocate_addPlayers" >Add Players!</button>
            </div>
          </card>
        </div>
        <div class="col-6">
          <card>
            <template slot="header">
              <h3 class="card-title">Key Performance Indicators</h3>
              <div id = "addKPI">
                <button type="button" class="btn btn-info" @click.prevent="relocate_addKPI" >Add KPI</button>
              </div>

            </template>
            <div id = "KPITable">
              <table class="table is-striped is-bordered is-narrow">
                <tbody v-for="KPI in KPI_list">
                <td> {{ KPI.KPI_title}}</td>
                </tbody>
              </table>
            </div>
          </card>
        </div>
      </div>

      <div class="home-panel" v-if="teamExist == 'no'">
        <div class="panel-heading">
          <strong> Create Your Team!</strong>
        </div>
        <div class="panel panel-default">
          <div class="panel-body">
          <div class="row">
            <div class="col-lg-12">
              <form id="createTeam-form" role="form" style="display: block;">
                <div class="form-group">
                  <label for="teamNameR">Team Name:</label><span class="help is-danger" v-show="teamNameRError">
                        {{ teamNameRError }}
                    </span>
                  <input type="text" name="teamNameR" v-model="teamNameR" tabindex="1" class="form-control" placeholder="Team Name" value="":class="['is-danger' ? teamNameRError : '', 'form-control']">
                </div>
                <div class="form-group">
                  <label for="teamLocationR">Location:</label><span class="help is-danger" v-show="teamLocationRError">
                        {{ teamLocationRError }}
                    </span>
                  <input type="text" name="teamLocationR" v-model="teamLocationR" tabindex="2" class="form-control" placeholder="Location":class="['is-danger' ? teamLocationRError : '', 'form-control']">
                </div>
                <div class="form-group">
                  <div class="row">
                    <button type="button" @click.prevent="validate" :disabled="formCheckSending" class="btn btn-success btn-lg">Create Team!</button>
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
  import { mapGetters, mapActions } from 'vuex'

  export default {
    props: ['role', 'user', 'userID', 'teamID', 'players', 'KPI_list' ,'teamExist','location', 'team_name', 'team_type'],
    components: {
      Card
    },
    data() {
      return {

        formCheckError: false,
        formCheckSending: false,
        teamNameRError: null,
        teamLocationRError: null,
        teamNameR: '',
        teamLocationR: '',
      }
    },

    methods: {
      validate(){
        console.log('checking')
        this.clearErrors();
        let valid = true;
        if(!this.teamNameR){ valid = false; this.teamNameRError = "*Team Name is Required"; }
        if(!this.teamLocationR){ valid = false; this.teamLocationRError = "*Location is required"; }
        this.loginError = null
        if(valid){
          this.createTeam();
        }
      },
      clearErrors(){
        this.teamNameRError = null;
        this.teamLocationRError = null;
      },
      createTeam() {

       var logTeam = {
         "userID": this.$store.getters['getUserID'],
         "teamName": this.teamNameR,
         "location": this.teamLocationR,
         "teamType": 'home',
       }
       axios({
         url: 'https://team-microservice.cfapps.io/createTeam',
         method: 'post',
         contentType: 'application/json',
         data: logTeam,
       }).then(result => {
         if (result.data.status == 'success') {
           location.reload()
         }
       }).catch(error => {
         console.log(error);
       });
      },
      relocate_addPlayers(){
        this.$router.push({ path: 'AddPlayers'})
      },
      relocate_editPlayers(){
        this.$router.push({ path: '/admin/manage-team/edit-players'})
      },
      relocate_addKPI(){
        this.$router.push({ path: '/admin/manage-team/add-kpi'})
      }
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
