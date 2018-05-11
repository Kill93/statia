<template>
  <div id="account">
    <div class="container">
      <img alt="" src="../../../../static/img/user.png">
      <div class="row">
        <div class="home-panel">
          <div class="panel panel-default">
            <div class="panel-heading">
              <strong> Account Details </strong>
              <i class="glyphicon glyphicon-edit"></i></div>
            <div class="panel-body">
              <div class="row">
                <div class="col-lg-12">
                  <table class="table table-bordered">
                    <tr>
                      <th class="blue-grey lighten-4">User ID</th>
                      <td>{{ userID }}</td></tr>
                    <tr>
                    <tr>
                      <th class="blue-grey lighten-4">First Name</th>
                      <td>{{ user_firstName }}</td></tr>
                    <tr>
                      <th>Gender</th>
                      <td>{{ user_lastName }}</td></tr>
                    <tr>
                      <th>Email</th>
                      <td>{{ user_email }}</td></tr>
                    <tr>
                      <th>Year Of Birth</th>
                      <td>{{ date1(user_dob) }}</td></tr>
                    <tr>
                      <th>Email</th>
                      <td>{{ user_email }}</td></tr>
                  </table>
                </div>
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
  import Datepicker from 'vuejs-datepicker';
  import moment from 'moment'

  export default {
    name: 'Home',
    props: ['role', 'user', 'userID'],
    data() {
      return {
        user_email: '',
        user_firstName: '',
        user_lastName: '',
        user_dob:'',
        emailR: '',
        firstNameR: '',
        lastNameR: '',
        passwordR:'',
        CpasswordR: '',
        dob: null,
        roleR: '',

        formCheckError: false,
        formCheckSending: false,
        firstNameError: null,
        lastNameError: null,
        roleError: null,
        emailError: null,
        passwordError: null,
        CpasswordError: null,
        CPpasswordError: null,
        dobError: null,
        registerError: null,
      }
    },
    components:{
      'datepicker': Datepicker
    },
    mounted(){
      this.getUser()
    },
    methods: {
      date1(date2) {
        return moment(String(date2)).format('DD - MMM - YYYY')
      },
      validate(){
        console.log('checking')
        this.clearErrors();
        let valid = true;
        if(!this.firstNameR){ valid = false; this.firstNameError = "*First Name is Required"; }
        if(!this.lastNameR){ valid = false; this.lastNameError = "*Last Name is Required"; }
        if(!this.roleR){ valid = false; this.roleError = "*Role is Required"; }
        if(!this.emailR){ valid = false; this.emailError = "*Email is Required"; }
        if(!this.passwordR){ valid = false; this.passwordError = "*Password is Required"; }
        if(!this.CpasswordR){ valid = false; this.CpasswordError = "*Please confirm your password"; }
        this.registerError = null
        if(valid){
          this.register();
        }
      },
      clearErrors(){
        this.firstNameError = null;
        this.lastNameError = null;
        this.roleError = null;
        this.emailError = null;
        this.passwordError = null;
        this.CpasswordError = null;
      },
      getUser(){
        var teamUser = {
          "user_id": this.$store.getters['getUserID'],
        }

        axios({
          url: 'https://users-microservice.cfapps.io/getUser',
          method: 'post',
          contentType: 'application/json',
          data: teamUser,
        }).then(result => {
          if (result.data.status == "none") {
            this.teamExist = 'no'
            console.log('No team for user yet ' + this.teamExist)
            this.location=''
            this.team_name=''
            this.team_type=''
          }
          if (result.data.status == "success") {
            this.teamExist = 'yes'
            // this.$emit('updateTeamID', result.data.team_id);
            // this.updateTeamID(result.data.team_id)
            this.user_email = result.data.user_email
            this.user_firstName = result.data.user_firstName
            this.user_lastName = result.data.user_lastName
            this.user_dob = result.data.user_dob
          }
        }).catch(error => {
          console.log(error);
        });
      },

      register() {
        var newUser = {
          "role": this.roleR,
          "email": this.emailR,
          "password": this.passwordR,
          "firstName": this.firstNameR,
          "lastName": this.lastNameR,
          "dob": this.dob,
        }

        if ( this.passwordR == this.CpasswordR) {
          this.CPpasswordError = null,
            axios({
              url: 'https://users-microservice.cfapps.io/register',
              method: 'post',
              contentType: 'application/json',
              data: newUser
            }).then(result => {
              if (result.data.status == "dupe") {
                this.registerError = "Email address already Registered!"
              }
              if (result.data.status == "success") {
                this.registerError = null
                this.formCheckSending = true;
                console.log(newUser)
                swal("Success! Please Log in to Get Started!", {
                  icon: "success",
                })
                  .then((value) => {
                    this.$router.push({ path: '/admin/login'});
                  });
              }
            }).catch(error => {
              console.log(error);
            });
        }
        else {
          this.CpasswordError="Passwords do not match"
        }
      },

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import '../../../assets/styles/app.scss';

  #account
  {
    text-align: center;
    margin: auto;
  }

  img{
    height: 50%;
    width:30%;
  }

  .home-panel
  {
    text-align: center;
    margin: auto;
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

  form b {
    color: blue;
  }

  table {
    text-align: center;
  }

  th {
    background-color: rgba(29,150,178,1);
    color: white;
    width: 50%;
    margin-left: 200%;
    text-align: center;
  }

  td {
    font-size: 1.2em;
  }

  panel-heading {
    background-color: blue;
  }

  i {
    float: right;
    font-size: 1.7em;
  }



</style>
