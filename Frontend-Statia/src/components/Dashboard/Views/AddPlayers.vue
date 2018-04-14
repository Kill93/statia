<template>
  <div class="AddPlayers">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card>
            <template slot="header">
              <h4 class="card-title">ADD PLAYERS</h4> {{ teamID }}
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
              <tbody>
              <tr v-for="(row, index) in rows">

                <td><input type="text" v-model="row.firstName"></td>
                <td><input type="text" v-model="row.lastName"></td>
                <td><input type="text" v-model="row.userID"></td>
                <td>
                  <button v-on:click="removeElement(index);" type="button" class="btn btn-danger">Remove</button>
                </td>


              </tr>
              </tbody>
            </table>
            <div>
              <button class="btn btn-info" @click="addRow">Add row</button>
            </div>
          </card>

          <button type="button" @click="addPlayers" class="btn btn-success">Save Team</button>
        </div>

      </div>
    </div>
  </div>
</template>
<script>

  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import axios from "axios";

  export default {
    props: ['teamID', 'teamExist'],
    components: {
      Card
    },
    data() {
      return {
        rows: []
      }
    },
    mounted() {},
    methods: {
      addRow: function() {
        var elem = document.createElement('tr');
        this.rows.push({
          firstName: "",
          lastName: "",
          userID:"",
          teamID: this.teamID
        });
      },
      removeElement: function(index) {
        this.rows.splice(index, 1);
      },
      addPlayers (){
        var players = []
        var i

        for (i = 0; i < this.rows.length; i++) {
          var logPlayers = {
            "teamID": this.teamID,
            "firstName": this.rows[i].firstName,
            "lastName": this.rows[i].lastName,
            "userID": this.rows[i].userID,
          }
          players.push(logPlayers);
        }
        console.log (players)
        axios({
          url: 'https://team-microservice.cfapps.io/addPlayers',
          method: 'post',
          contentType: 'application/json',
          data: players,
        }).then(result => {
          if (result.data.status == 'success') {
            console.log('success')
            this.$router.push({ path: 'manage-team'})
            location.reload()
          }
        }).catch(error => {
          console.log(error);
        });
      // },
      }
    }
  }
</script>
<style>

</style>
