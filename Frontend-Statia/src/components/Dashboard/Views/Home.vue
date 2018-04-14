<template>
  <div class="container">
    {{ stopwatchStatus }}
    <h2>{{ minutes }} : {{ seconds }}</h2>
    <button id="start" @click="timer">START</button>
    <button id="stop" @click="pause">STOP</button>
    <button id="clear">RESET</button>
  </div>
</template>

<style>

</style>

<script>
  module.exports = {
    data: function() {
      return {
        seconds:0,
        minutes:0,
        timeS: '00:00',
        stopwatchStatus:'paused',
        interval: 0
      }
    },
    computed: {
      time() {
        if (this.seconds >= 60) {
          this.seconds = 0;
          this.minutes++;
        }
      }
    },
    methods: {
      add (){
        if (this.stopwatchStatus =='going') {
          this.seconds++;
          this.seconds = this.minTwoDigits(this.seconds)
          this.timer()
        }
      },
      pause (){
        this.stopwatchStatus ='paused'
        this.interval=0
      },
      timer(){
        this.stopwatchStatus ='going'
        this.interval=1000
        t = setTimeout(this.add, this.interval);
      },
      minTwoDigits(n) {
        return (n < 10 ? '0' : '') + n;
      }
    }
  }
</script>
<style scoped lang="scss">
  @import '../../../assets/styles/app.scss';

  #start {
    margin: 40px auto;
    text-align: center;
    color: #DAD6D6;
    background: #48633B;
    border:solid 2px #35492C;
    border-radius:5px;
    padding:16px 40px 16px;
    letter-spacing: 2px;
    cursor:pointer;
  }

  #stop {
    margin: 40px 5px auto;
    text-align: center;
    color: #DAD6D6;
    background: #721329;
    border:solid 2px #590F20;
    border-radius:5px;
    padding:16px 40px 16px;
    letter-spacing: 2px;
    cursor:pointer;
  }

  #clear {
    margin: 40px auto;
    text-align: center;
    color: #DAD6D6;
    background: #564E58;
    border:solid 2px #3E383F;
    border-radius:5px;
    padding:16px 40px 16px;
    letter-spacing: 2px;
    cursor:pointer;
  }

  h2
  {
    font-size: 46px;
    letter-spacing: 2px;
    margin: 200px 0 0 ;
  }

</style>
