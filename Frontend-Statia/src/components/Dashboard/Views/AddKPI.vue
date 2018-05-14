<template>
  <div class="add-KPI">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card>
            <template slot="header">
              <h4 class="card-title">ADD KPI </h4>
            </template>

            <table class="table is-striped is-bordered is-narrow">
              <thead>
              <tr>
                <td><strong>Title</strong></td>
                <td><strong>Description</strong></td>
                <td></td>
              </tr>
              </thead>
              <tbody >
              <tr v-for="(row, index) in rowsBase">
                <td class="rowsBase1">{{ row.KPI_title }}</td>
                <td class="rowsBase2">{{ row.KPI_description }} </td>
              </tr>

              <tr v-for="(rowC, index) in rowsCustom">
                <td class="rowsCustom"><input type="text" :id="'title' + index" v-model="rowC.KPI_title"></td>
                <td class="rowsCustom"><input type="text"  size="50" :id="'description' + index" v-model="rowC.KPI_description">
                <br>
                  <button v-on:click="removeElement(index);" type="button" class="btn btn-danger">Remove</button>
                </td>

              </tr>
              </tbody>
            </table>
            <div>
              <button class="btn btn-info" @click="addRow">Add KPI</button>
            </div>
          </card>

          <button type="button" @click="addKPI" class="btn btn-success btn-lg">Save KPI List</button>
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
        rowsBase: [],
        rowsCustom: []
      }
    },
    mounted() {
      var i
      for (i = 0; i < this.KPI_list.length; i++) {
        var KPILIST = {
          "KPI_id": this.KPI_list[i].KPI_id,
          "KPI_title": this.KPI_list[i].KPI_title,
          "KPI_description": this.KPI_list[i].KPI_description,
          "KPI_type": this.KPI_list[i].KPI_type,
        }
        if(this.KPI_list[i].KPI_type == 'base') {
          this.rowsBase.push(KPILIST)
        }
        else{
          this.rowsCustom.push(KPILIST)
        }
      }
    },
    methods: {
      addRow: function() {
        var elem = document.createElement('tr');
        this.rowsCustom.push({
          KPI_id: null,
          firstName: "",
          lastName: "",
          userID:"",
          teamID: this.teamID
        });
        document.getElementById('title' + rowsCustom.length).disabled = false;
        document.getElementById('description' + rowsCustom.length).disabled = false;
      },
      disable: function(index) {
        document.getElementById('title' + index).disabled = true;
        document.getElementById('description' + index).disabled = true;
        // d.className += "disabled";
      },
      removeElement: function(index) {
        swal({
          title: "Are you sure?",
          text: "Once deleted and you save your KPI list, you will not be able to recover the data from this KPI!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
          .then((willDelete) => {
            if (willDelete) {
              this.rowsCustom.splice(index, 1);
            } else {
            }
          });
      },
      addKPI (){
        var newKPI = []
        var i

        for (i = 0; i < this.rowsCustom.length; i++) {
          var logKPI = {
            "KPI_id": this.rowsCustom[i].KPI_id,
            "KPI_title": this.rowsCustom[i].KPI_title,
            "KPI_description": this.rowsCustom[i].KPI_description,
            "KPI_type": 'custom',
            "userID": this.$store.getters['getUserID'],
          }
          newKPI.push(logKPI);
        }
        axios({
          url: 'https://team-microservice.cfapps.io/editKPIList',
          method: 'post',
          contentType: 'application/json',
          data: newKPI,
        }).then(result => {
          if (result.data.status == 'success') {
            console.log('success')
            swal({
              title: "Are you sure?",
              text: "Once confirmed, all changes are non-reversable!",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            })
              .then((willDelete) => {
                if (willDelete) {
                  swal("Success! Your KPI list has been saved!", {
                    icon: "success",
                  })
                  console.log('success')
                  this.sleep(2000)
                  this.$emit('getKPI_list');
                  this.$router.push({ path: '/admin/manage-team'})
                } else {
                }
              });
          }
        }).catch(error => {
          console.log(error);
        });
        // },
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

  .add-KPI {
    width: 70%;
    margin:auto;
    text-align: center;
    min-height: 900px;
    margin-bottom: 100px;
    font-size: .9em;
  }

  button {
    margin:auto;
    text-align: center;
  }

  .rowsBase1 {
    color: green;
    font-weight: bold;
  }



</style>
