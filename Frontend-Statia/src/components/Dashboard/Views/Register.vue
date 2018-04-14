<template>
  <div id="register">
    <div class="container">
      <img src="../../../assets/statialogo.png">
      <div class="row">
        <div class="home-panel">
          <div class="panel panel-default">
            <div class="panel-heading">
              <strong> Register</strong>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-lg-12">
                  <form id="register-form" role="form" style="display: block;">
                    <div class="form-group">
                      <label for="sel1" >Role:</label><span class="help is-danger" v-show="roleError">
                        {{ roleError }}
                    </span>
                      <select class="form-control" v-model="roleR" id="sel1" :class="['is-danger' ? roleError : '', 'form-control']">
                        <option class="active">Coach</option>
                        <option>Player</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label for="firstNameR">First Name:</label>                      <span class="help is-danger" v-show="firstNameError">
                        {{ firstNameError }}
                    </span>
                      <input type="text" name="firstName" v-model="firstNameR" tabindex="1" class="form-control" placeholder="First Name" value="" :class="['is-danger' ? firstNameError : '', 'form-control']">
                    </div>
                    <div class="form-group">
                      <label for="LASTNameR">Last Name:</label>                      <span class="help is-danger" v-show="lastNameError">
                        {{ lastNameError }}
                    </span>
                      <input type="text" name="lastName" v-model="lastNameR" tabindex="1" class="form-control" placeholder="Last Name" value="":class="['is-danger' ? lastNameError : '', 'form-control']">
                    </div>
                    <div class="form-group">
                      <label for="dob">Date of Birth:</label><br>                      <span class="help is-danger" v-show="dobError">
                        {{ dobError }}
                    </span>
                      <br>
                      <datepicker v-model="dob" placeholder="DD MMM YYYY"cd2></datepicker>
                    </div>
                    <div class="form-group">
                      <label for="emailR">Email:</label>                      <span class="help is-danger" v-show="emailError">
                        {{ emailError }}
                    </span>
                      <span class="help is-danger" v-show="registerError">
                        {{ registerError }}
                    </span>
                      <input type="email" name="emailR" v-model="emailR" tabindex="1" class="form-control" placeholder="Email Address" value="":class="['is-danger' ? emailError : '', 'form-control']">
                    </div>
                    <div class="form-group">
                      <label for="passwordR">Password:</label>                      <span class="help is-danger" v-show="passwordError">
                        {{ passwordError }}
                    </span>
                      <input type="password" name="passwordR" v-model="passwordR" tabindex="2" class="form-control" placeholder="Password":class="['is-danger' ? passwordError : '', 'form-control']">
                    </div>
                    <div class="form-group">
                      <label for="passwordR">Confirm password:</label>                      <span class="help is-danger" v-show="CpasswordError">
                        {{ CpasswordError }}
                    </span>
                      <span class="help is-danger" v-show="CPpasswordError">
                        {{ CPpasswordError }}
                    </span>
                      <input type="password" name="passwordR" v-model="CpasswordR" tabindex="2" class="form-control" placeholder="Password":class="['is-danger' ? passwordError : '', 'form-control']">
                    </div>
                    <div class="form-group">
                      <div class="row">
                        <button type="button" @click.prevent="validate" :disabled="formCheckSending" class="btn btn-info btn-lg">Register</button>
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
  </div>
</template>

<script>

  import axios from "axios";
  import Datepicker from 'vuejs-datepicker';

  export default {
    name: 'Home',
    props: ['role', 'user', 'userID'],
    data() {
      return {
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
    methods: {
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

  #register
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

</style>
