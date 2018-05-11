<template>
  <div class="matches">
    <div class="container">
      <hr>
      <div id = "createMatch">
        <button type="button" class="btn btn-info" @click.prevent="relocate_createMatch" >Create Match</button>
      </div>
      <br>
      <vue-tabs>
        <v-tab title="Complete" class="active">
        <br>
          <table class="table">
            <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Competition</th>
              <th scope="col">Opposition</th>
              <th scope="col"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="matches in matchesComplete">
              <td class = "match">  {{ date1(matches.match_date) }} </td>
              <td class = "match">{{ matches.match_competition }}</td>
              <td class = "match">{{ matches.opposition_name }}</td>
              <td class = "match"><button type="button" @click="selectMatch(matches.match_id)" class="btn btn-success btn">View Match</button></td>
            </tr>
            </tbody>
          </table>
        </v-tab>
        <v-tab title="Upcoming">
          <br>
          <table class="table">
            <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Competition</th>
              <th scope="col">Opposition</th>
              <th scope="col"></th>

            </tr>
            </thead>
            <tbody>
            <tr v-for="matches in matchesDue">
              <td class = "match">{{ date1(matches.match_date) }}</td>
              <td class = "match">{{ matches.match_competition }}</td>
              <td class = "match">{{ matches.opposition_name }}</td>
              <td class = "match"><button type="button" @click="selectMatch(matches.match_id)" class="btn btn-success btn">View Match</button></td>
            </tr>
            </tbody>
          </table>
        </v-tab>
      </vue-tabs>
    </div>
  </div>
</template>
<script>
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import {VueTabs, VTab} from 'vue-nav-tabs'
  import 'vue-nav-tabs/themes/vue-tabs.css'
  import moment from 'moment'

  export default {
    props: ['role', 'user', 'userID', 'selectedMatch', 'teamID', 'players', 'KPI_list' ,'teamExist','location','matchesDue', 'matchesComplete', 'team_name', 'team_type'],
    components: {
      Card,
      VueTabs,
      VTab
    },
    computed: {
    },
    data() {
      return {
      }
    },
    mounted(){
        this.$emit('updateMatches', '1');
    },
    methods: {
      date1(date2) {
        return moment(String(date2)).format('DD - MMM - YYYY')
      },
      relocate_createMatch(){
        this.$router.push({ path: 'matches/createMatch'})
      },
      selectMatch(id){
        this.$emit('selectMatch', id);
        this.sleep(500)
        this.$router.push({ path: 'matches/viewMatch'})
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

  .panel
  {
    margin: auto;
    width: 90%;
  }

  .filterable {
    margin-top: 15px;
  }
  .filterable .panel-heading {
    color: #40a0e0;
    background-color: #17252A;
  }
  .filterable .filters input[disabled] {
    background-color: transparent;
    border: none;
    cursor: auto;
    box-shadow: none;
    padding: 0;
    height: auto;
  }
  .filterable .filters input[disabled]::-webkit-input-placeholder {
    color: #333;
  }
  .filterable .filters input[disabled]::-moz-placeholder {
    color: #333;
  }
  .filterable .filters input[disabled]:-ms-input-placeholder {
    color: #333;
  }

  .vue-tabs title {
    color: blue;
  }

  thead {
    background-color: #17252A;
    color: #40a0e0;
  }

  .match {
    width: 10%;
  }


</style>
