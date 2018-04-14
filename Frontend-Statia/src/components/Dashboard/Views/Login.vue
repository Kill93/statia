<template>
  <div id="login">
    <div class="container">
      <img src="../../../assets/statialogo.png">
      <div class="row">
        <div class="home-panel">
          <div class="panel panel-default">
            <div class="panel-heading">
              <strong> Login</strong>
              {{ $store.state.userID }}
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-lg-12">
                  <form id="login-form" role="form" style="display: block;">
                    <span class="help is-danger" v-show="loginError">
                        {{ loginError }}
                    </span>
                    <div class="form-group">
                      <label for="emailL">Email:</label><span class="help is-danger" v-show="emailLError">
                        {{ emailLError }}
                    </span>
                      <input type="text" name="emailL" v-model="emailL" tabindex="1" class="form-control" placeholder="Email" value="":class="['is-danger' ? emailLError : '', 'form-control']">
                    </div>
                    <div class="form-group">
                      <label for="passwordL">Password:</label><span class="help is-danger" v-show="passwordLError">
                        {{ passwordLError }}
                    </span>
                      <input type="password" name="passwordL" v-model="passwordL" tabindex="2" class="form-control" placeholder="Password":class="['is-danger' ? passwordLError : '', 'form-control']">
                    </div>
                    <div class="form-group">
                      <div class="row">
                        <button type="button" @click.prevent="validate" :disabled="formCheckSending" class="btn btn-success btn-lg">Login</button>
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
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'Home',
    computed: mapGetters([
      'getToken',
    ]),
    methods: mapActions([
      'addToken',
      'removeToken',
    ]),
    data() {
      return {
        emailL: '',
        passwordL: '',
        emailR: '',
        user: 'guest',
        role:'',
        userID: '',
        token: '',

        formCheckError: false,
        formCheckSending: false,
        emailLError: null,
        passwordLError: null,
        loginError:null,
      }
    },
    methods: {
      validate(){
        console.log('checking')
        this.clearErrors();
        let valid = true;
        if(!this.passwordL){ valid = false; this.passwordLError = "*Password is Required"; }
        if(!this.emailL){ valid = false; this.emailLError = "*e-mail is required"; }
        this.loginError = null
        if(valid){
          this.login();
        }
      },
      clearErrors(){
        this.emailLError = null;
        this.passwordLError = null;
      },
      login() {

        var logUser = {
          "email": this.emailL,
          "password": this.passwordL,
        }

        axios({
          url: 'https://users-microservice.cfapps.io/login',
          method: 'post',
          contentType: 'application/json',
          data: logUser,
        }).then(result => {
          if (result.data.status == "invalid") {
            this.loginError = "Email or password is incorrect!"
          }
          if (result.data.success) {
            this.loginError = null
            this.role = result.data.role,
              this.user = result.data.firstName,
              this.userID = result.data.id,
              this.token = result.data.token
            let payload = {'token1': this.token, 'user1': this.user, 'userID1': this.userID, 'role1': this.role}
            this.$store.commit('addToken', payload)
            this.$router.push({ path: 'dashboard'})
            console.log(payload)
            location.reload()
          }
        }).catch(error => {
          console.log(error);
        });
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import '../../../assets/styles/app.scss';

  #login
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

</style>
