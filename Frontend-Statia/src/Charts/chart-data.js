import {Line} from 'vue-chartjs'

export default {
  extends: Line,
  props: ['checkedMatches', 'options'],
  data() {
    return {
      labels: []
    }
  },
  mounted () {
    console.log(this.matchesComplete)
    this.assignMatches()
    this.renderChart({
      labels: this.labels,
      datasets: [
        {
          label: 'Matches',
          backgroundColor: '#FC2525',
          data: []
        },
      ]
    }, {responsive: true, maintainAspectRatio: false})
  },
  methods: {
    assignMatches() {
      for(var i=0; i < this.checkedMatches.length; i ++){
        this.labels.push(this.checkedMatches[i])
      }
    }
  }
}
