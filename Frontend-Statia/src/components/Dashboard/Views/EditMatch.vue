<template>
  <div class="editMatch">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card>
            <template slot="header">
{{ match[0].match_status }}
              <table class="table">
                <tbody v-for="m in match">
                <tr>
                  <th scope="col">Opposition</th>
                  <td class = "match"><input type="text" v-model="match[0].opposition_name"></td>
                </tr>
                <tr>
                  <th scope="col">Competition</th>
                  <td class = "match"><input type="text" v-model="match[0].match_competition"></td>
                </tr>
                <tr>
                  <th scope="col">Date</th>
                  <td class = "match"><datepicker :placeholder=match[0].match_date cd2 v-model="match[0].match_date"></datepicker></td>
                </tr>
                <tr>
                  <th scope="col">Location</th>
                  <td class = "match"><input type="text" v-model="match[0].match_location"></td>
                </tr>
                <tr>
                  <th scope="col">Status</th>
                  <td class = "match">
                    <select class="form-control" v-model="match[0].match_status" id="sel1">
                      <option class="active">complete</option>
                      <option>due</option>
                    </select></td>
                </tr>
                </tbody>
                <button type="button" @click="save" class="btn btn-success btn-lg">Save</button>
              </table>
            </template>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import axios from "axios";
  import Datepicker from 'vuejs-datepicker';

  export default {
    props: ['role', 'user', 'userID', 'selectedMatch', 'teamID', 'players', 'KPI_list', 'teamExist', 'location', 'matchesDue', 'matchesComplete', 'team_name', 'team_type', 'awayTeams'],
    components: {
      Card,
      'datepicker': Datepicker
    },
    data() {
      return {
        match: []
      }
    },
    mounted() {
      this.getMatch()
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
        }).catch(error => {
          console.log(error);
        });
      },
      save (){
        swal({
          title: "Are you sure?",
          text: "Once confirmed, all changes are non-reversable!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
          .then((willDelete) => {
            if (willDelete) {
              axios({
                url: 'https://matches-microservice.cfapps.io/editMatchDetails',
                method: 'post',
                contentType: 'application/json',
                data: this.match,
              }).then(result => {
                if (result.data.status == 'success') {
                  console.log('success')
                  this.$router.push({ path: '/admin/matches/viewMatch'})
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

  button {
    margin-left: 90%;
    margin-top: 20px;
  }

</style>
