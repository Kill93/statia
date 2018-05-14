<template>
  <div class="home">
    <div class="container-fluid">
      <div class="row">
        <div class="middle">

          <img src="../../../assets/statialogo.png">

          <h2> Welcome to Statia</h2>
          <h3> A statistical analysis tool to improve performances in the GAA</h3> <br>
          <button type="button" @click.prevent="loginPage" class="btn btn-success btn-lg">Login</button> &nbsp; <button type="button" @click.prevent="RegisterPage" class="btn btn-info btn-lg">Register</button>


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
    props: ['teamID', 'teamExist', 'KPI_list'],
    components: {
      Card
    },
    data() {
      return {
      }
    },
    mounted() {
    },
    methods: {
      loginPage(){
        this.$router.push({ path: '/admin/login'});
      },
      RegisterPage(){
        this.$router.push({ path: '/admin/register'});
      }
    }
  }
</script>
<style scoped lang="scss">
  @import '../../../assets/styles/app.scss';

  .home {
    margin:auto;
    text-align: center;
    margin-bottom: 100px;
  }

  img{
    height: 60%;
    width:40%;
  }

  .middle {
    margin:auto;
  }

  button {
    margin:auto;
    text-align: center;
  }

  h2 {
    text-shadow: 2px 2px 2px #CCCCCC;
  }



</style>
