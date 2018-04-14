<template>
  <div class="edit-players">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card>
            <template slot="header">
              <h4 class="card-title">EDIT PLAYERS </h4>
            </template>

            <table class="table is-striped is-bordered is-narrow">
              <thead>
              <tr>
                <td><strong>First Name</strong></td>
                <td><strong>Last Name</strong></td>
                <td><strong>User ID (If applicable) </strong></td>
                <td></td>
              </tr>
              </thead>
              <tbody >
              <tr v-for="(row, index) in rows">

                <td><input type="text" :id="'firstName' + index" v-model="row.firstName"></td>
                <td><input type="text"  :id="'lastName' + index" v-model="row.lastName"></td>
                <td><input type="text" disabled = "true" :id="'userID' + index" v-model="row.userID"></td>
                <td>
                  <button v-on:click="removeElement(index);" type="button" class="btn btn-danger">Remove</button>
                </td>


              </tr>
              </tbody>
            </table>
            <div>
              <button class="btn btn-info" @click="addRow">Add Player</button>
            </div>
          </card>

          <button type="button" @click="saveTeam" class="btn btn-success btn-lg">Save Team</button>
        </div>

      </div>
    </div>
  </div>
</template>
<script>

  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import axios from "axios";
  import swal from 'sweetalert'

  export default {
    props: ['teamID', 'teamExist', 'players'],
    components: {
      Card
    },
    data() {
      return {
        rows: [],
      }
    },
    mounted() {
      var i
      for (i = 0; i < this.players.length; i++) {
        var playersTemp = {
          "playerID": this.players[i].playerID,
          "teamID": this.players[i].teamID,
          "firstName": this.players[i].firstName,
          "lastName": this.players[i].lastName,
          "userID": this.players[i].userID,
        }
        this.rows.push(playersTemp)
      }
    },
    methods: {
      addRow: function() {
        var elem = document.createElement('tr');
        this.rows.push({
          playerID: null,
          firstName: "",
          lastName: "",
          userID:"",
          teamID: this.teamID
        });
        document.getElementById('firstName' + this.rows.length).disabled = false;
        document.getElementById('lastName' + this.rows.length).disabled = false;
        document.getElementById('userID' + this.rows.length).disabled = false;
      },
      disable: function(index) {
        document.getElementById('firstName' + index).disabled = true;
        document.getElementById('lastName' + index).disabled = true;
        document.getElementById('userID' + index).disabled = true;
        // d.className += "disabled";
      },
      removeElement: function(index) {
        swal({
          title: "Are you sure?",
          text: "Once deleted and you save your team, you will not be able to recover this players data!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
          .then((willDelete) => {
            if (willDelete) {
              this.rows.splice(index, 1);
            } else {
            }
          });
      },
      saveTeam (){
            swal({
              title: "Are you sure?",
              text: "Once confirmed, all changes are non-reversable!",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            })
              .then((willDelete) => {
                if (willDelete) {
                  var players = []
                  var i

                  for (i = 0; i < this.rows.length; i++) {
                    var logPlayers = {
                      "playerID": this.rows[i].playerID,
                      "teamID": this.teamID,
                      "firstName": this.rows[i].firstName,
                      "lastName": this.rows[i].lastName,
                      "userID": this.rows[i].userID,
                    }
                    players.push(logPlayers);
                  }
                  console.log (players)
                  axios({
                    url: 'https://team-microservice.cfapps.io/editPlayerList',
                    method: 'post',
                    contentType: 'application/json',
                    data: players,
                  }).then(result => {
                    if (result.data.status == 'success') {
                      console.log('success')
                      this.$router.push({ path: '/admin/manage-team'})
                      this.sleep(2000)
                  swal("Success! Your team has been saved!", {
                    icon: "success",
                  })
                } else {
                }
              });
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

  .edit-players {
    width: 70%;
    margin:auto;
    text-align: center;
    min-height: 900px;
    margin-bottom: 100px;
  }

  button {
    margin:auto;
    text-align: center;
  }



</style>
