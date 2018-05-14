<template>
  <div class = "content">
  <transition name="fade" mode="out-in">
    <router-view @selectMatch="selectMatch" @getMatchesP="getMatchesP" @getMatchDataP="getMatchDataP" @emitPlayerID="emitPlayerID" @updateMatches="updateMatches" @getTeam="getTeam" @getKPI_list="getKPI_list" :matchesComplete="matchesComplete" :matchesReady="matchesReady" :selectedMatch="selectedMatch" :matchesDue="matchesDue" :user="user" :role="role" :userID="userID" :KPI_list="KPI_list" :location="location" :players="players" :teamID="teamID"  :team_name="team_name" :team_type="team_type" :teamExist="teamExist" :playerAccountID="playerAccountID" :matchIDs="matchIDs" :matchesP="matchesP" ></router-view>
  </transition>
  </div>
</template>
<script scoped>
  /* eslint-disable */
  import axios from "axios";

  export default {
    props: ['matchIDs', 'matchesP', 'playerAccountID', 'role', 'user', 'KPI_list', 'userID','matchesDue', 'matchesReady', 'matchesComplete','teamExist','location', 'team_name','selectedMatch', 'team_type', 'teamID', 'players'],
    data() {
      return {
      }
    },
    mounted() {
    },
    methods: {
      getTeam(){
        this.$emit('getTeam');
      },
      getKPI_list() {
        this.$emit('getKPI_list');
      },
      selectMatch(id) {
        this.$emit('selectMatch', id);
        console.log(id)
      },
      updateMatches(id) {
        this.$emit('updateMatches', '1');
      },
      emitPlayerID(player_id){
        this.$emit('emitPlayerID', player_id);
      },
      getMatchesP(){
        this.$emit('getMatchesP', 1);
      },
      getMatchDataP(){
        this.$emit('getMatchDataP', 1);
      },
    }
  }

</script>
<style scoped lang="scss">
  @import '../../../assets/styles/app.scss';

  .content {
    min-height: 100%;
    padding-bottom: 180px;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .1s
  }

  .fade-enter,
  .fade-leave-to
    /* .fade-leave-active in <2.1.8 */

  {
    opacity: 0
  }
</style>
