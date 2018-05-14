<template>
  <div class="dashboard">

    <div v-if="role == 'Player'" class="container-fluid">
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
        <tr v-for="matches in matchesP">
          <td class = "match">  {{ date1(matches.match_date) }} </td>
          <td class = "match">{{ matches.match_competition }}</td>
          <td class = "match">{{ matches.opposition_name }}</td>
          <td class = "match"><button type="button" @click="selectMatch(matches.match_id)" class="btn btn-success btn">View Match</button></td>
        </tr>
        </tbody>

      </table>
    </div>

    <div v-if="role == 'Coach'" class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card>
            <template slot="header">
              <h4> Ready</h4>
            </template>
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
              <tr v-for="matches in matchesReady">
                <td class = "match">{{ date1(matches.match_date) }}</td>
                <td class = "match">{{ matches.match_competition }}</td>
                <td class = "match">{{ matches.opposition_name }}</td>
                <td class = "match"><button type="button" @click="relocate_matchEvent(matches.match_id)" class="btn btn-success btn">Resume</button></td>
              </tr>
              </tbody>
            </table>
          </card>

          <br>

          <card>
            <template slot="header">
              <h4> Coming Up</h4>
            </template>
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
                <td class = "match"><button type="button" @click="relocate_preEvent(matches.match_id)" class="btn btn-success btn">Set Up</button></td>
              </tr>
              </tbody>
            </table>
          </card>
        </div>

      </div>
    </div>
  </div>
</template>
<script>

  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import moment from 'moment'
  import axios from "axios";

  export default {
    props: ['matchIDs', 'matchesP','playerAccountID', 'role', 'user', 'userID','selectedMatch','teamID', 'players', 'KPI_list' ,'teamExist','location','matchesDue', 'matchesComplete', 'matchesReady', 'team_name', 'team_type', 'awayTeams'],
    components: {
      Card
    },
    data() {
      return {
        }
      },
    mounted(){
      if (this.role == 'Coach'){
        this.$emit('updateMatches', '1');
      }
      // this.matchesDue.sort(this.compare);
    },
    methods: {
      selectMatch(id){
        this.$emit('selectMatch', id);
        this.$router.push({ path: 'matches/viewMatch'})
      },
      getMatchesP(){
        this.$emit('getMatchesP', 1);
      },
      emitPlayerID(player_id){
        this.$emit('emitPlayerID', player_id);
      },
      getMatchDataP(){
        this.$emit('getMatchDataP', 1);
      },
      date1(date2) {
        return moment(String(date2)).format('DD-MMM-YYYY')
      },
      relocate_matchEvent(id){
        this.$emit('selectMatch', id);
        this.$router.push({ path: '/admin/dashboard/matchEvent'})
      },
      relocate_preEvent(id){
        this.$emit('selectMatch', id);
        this.$router.push({ path: '/admin/dashboard/preEvent'})
      },
      compare(a,b) {
        console.log('match')
        if (a.match_date < b.match_date)
          return -1;
        if (a.match_date > b.match_date)
          return 1;
        return 0;
      },
    }
  }
</script>
<style scoped lang="scss">
  @import '../../../assets/styles/app.scss';

  .dashboard {
    min-height: 70vh;
  }

  img{
    height: 50%;
    width:30%;
  }

</style>
