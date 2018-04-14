<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Dashboard {{ user }} {{ userID}}</a>
      <div class="collapse navbar-collapse justify-content-end">
        <ul class="nav navbar-nav mr-auto">
          <li class="nav-item">
            <a class="nav-link" href="#" data-toggle="dropdown">
              <i class="nc-icon nc-palette"></i>
            </a>
          </li>
          <!--<drop-down tag="li">-->
            <!--<template slot="title">-->
              <!--<i class="nc-icon nc-planet"></i>-->
              <!--<b class="caret"></b>-->
              <!--<span class="notification">5</span>-->
            <!--</template>-->
            <!--<a class="dropdown-item" href="#">Notification 1</a>-->
            <!--<a class="dropdown-item" href="#">Notification 2</a>-->
            <!--<a class="dropdown-item" href="#">Notification 3</a>-->
            <!--<a class="dropdown-item" href="#">Notification 4</a>-->
            <!--<a class="dropdown-item" href="#">Another notification</a>-->
          <!--</drop-down>-->
        </ul>
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <a class="nav-link" href="#">
              Account
            </a>
          </li>
          <drop-down title="Dropdown">
            <a class="dropdown-item" href="#">LINK 1</a>
            <a class="dropdown-item" href="#">LINK 2</a>
            <a class="dropdown-item" href="#">LINK 3</a>
            <a class="dropdown-item" href="#">LINK 4</a>
            <a class="dropdown-item" href="#">LINK 5</a>
            <div class="divider"></div>
            <a class="dropdown-item" href="#">Separated link</a>
          </drop-down>
          <li v-if="user != 'guest'"><a href="#" v-on:click="logout()"><b><span class="glyphicon glyphicon-log-out"></span></b> Logout</a></li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script scoped>
  /* eslint-disable */

  export default {
    props: ['role', 'user', 'userID'],
    computed: {
      routeName () {
        const {name} = this.$route
        return this.capitalizeFirstLetter(name)
      }
    },
    data () {
      return {
      }
    },
    methods: {
      logout () {
        swal({
          title: "Are you sure you want to log out?",
          text: "",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
          .then((willDelete) => {
            if (willDelete) {
              this.$store.commit('removeToken', 1)
              this.$emit('isLoggedIn');
              this.$router.push({ path: '/admin/home'})
              this.sleep(5000)
              location.reload()
            } else {
            }
          });
      },
      capitalizeFirstLetter (string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      },
      closeDropDown () {
        this.activeNotifications = false
      },
      sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
          if ((new Date().getTime() - start) > milliseconds){
            break;
          }
        }
      },
//      toggleSidebar () {
//        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
//      },
//      hideSidebar () {
//        this.$sidebar.displaySidebar(false)
//      }
    }
  }

</script>
<style scoped lang="scss">
  @import '../../../assets/styles/app.scss';
  


</style>
