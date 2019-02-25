console.log('Executing client side javascript...');

const temperatureDisplay = document.getElementById('temperature-display')
const humidityDisplay = document.getElementById('humidity-display')
    
    /*
     Here, we take the configuration out and declare it as a
     variable first.
   */
    const temperatureChartConfig = {
      type: 'line',
      data: {
        /*
        For our actual data, we will not have any readings 
    initially
        */
       labels: [],
       datasets: [{
          data: [],
          backgroundColor: 'rgba(255, 205, 210, 0.5)'
        }]
      },
      options: {
        legend: {
          display: false
        },
        responsive: true,
        maintainAspectRatio: false,
        /*
        Add in the range for the Y-axis. Where I live, the 
     temperature varies from 15-35 °C
        With a 5 °C buffer range, that gives us a minimum 
     value of 10 and maximum of 40
        */
        scales: {
          yAxes: [{
            ticks: {
              suggestedMin: 10,
              suggestedMax: 40
            }
          }]
        }
      }
    }

   /*
     Here, we take the configuration out and declare it as a
     variable first.
   */
    const humidityChartConfig = {
      type: 'line',
      data: {
        /*
        For our actual data, we will not have any readings 
    initially
        */
       labels: [],
       datasets: [{
          data: [],
          backgroundColor: 'rgba(197, 202, 203, 0.5)'
        }]
      },
      options: {
        legend: {
          display: false
        },
        responsive: true,
        maintainAspectRatio: false,
        /*
        Add in the range for the Y-axis. Where I live, the 
     temperature varies from 15-35 °C
        With a 5 °C buffer range, that gives us a minimum 
     value of 10 and maximum of 40
        */
        scales: {
          yAxes: [{
            ticks: {
              suggestedMin: 30,
              suggestedMax: 90
            }
          }]
        }
      }
    }

       /**
     * Get the context of the temperature canvas element
     */
     const temperatureCanvasCtx = 
     document.getElementById('temperature-chart').getContext('2d')

    /**
     * Create a new chart on the context we just instantiated
    */
    const temperatureChart = new Chart(temperatureCanvasCtx, 
       temperatureChartConfig);

       /**
     * Get the context of the temperature canvas element
     */
     const humidityCanvasCtx = 
     document.getElementById('humidity-chart').getContext('2d')

    /**
     * Create a new chart on the context we just instantiated
    */
    const humidityChart = new Chart(humidityCanvasCtx, 
       humidityChartConfig);

    const pushData = (arr, value, maxLen) => {
      /*
      Push the new value into the array
     */
      arr.push(value)

      /*
      If the length of the array is greater than the maximum
      length allowed, push the first element out (through the
     Array#shift method)
      */
      if (arr.length > maxLen) {
        arr.shift()
      }
    }

/*
     The fetch API uses a promise based syntax. It may look a  
    little weird if you're seeing it for the first time, but    
    it's an improvement over callbacks.
    */
    /*
    We put the code for fetching temperature in its own 
    function
    */
    const fetchTemperature = () => {
      fetch('/temperature')   
        .then(results => {
           /**
           * We want the results converted to json, so we use 
    the fetch results' `json` method, which returns a promise 
    with the JSON data instead of the string
           */
          return results.json()
        })
        .then(data => {
          /*
          Note the time when the reading is obtained,
          and convert it to hh:mm:ss format
          */
          const now = new Date()
          const timeNow = now.getHours() + ':' + 
    now.getMinutes() + ':' + now.getSeconds()

          /*
          Add the data to the chart dataset

          The x-axis here is time, with the time of 
    measurement added as its value. Since it is measure in 
    regular intervals,
          we do not need to scale it, and can assume a 
    uniform regular interval
          The y-axis is temperature, which is stored in 
    `data.value`

          The data is being pushed directly into the 
    configuration we described above.
          A maximum length of 10 is maintained. Which means 
    that after 10 readings are filled in the dataset, the 
    older readings will start being pushed out.
          */
           pushData(temperatureChartConfig.data.labels,
     timeNow, 10)
          pushData(temperatureChartConfig.data.datasets[0]
     .data, data.value, 10)

          /*
          `temperatureChart` is our ChartJs instance. The 
    `update` method looks for changes in the dataset and 
    axes, and animates and updates the chart accordingly.
          */
          temperatureChart.update()

          /**
           * We add in the HTML tags on the front end script 
    this time, leaving the backend to only provide us data
           */
          temperatureDisplay.innerHTML = '<strong>' + data.value + '</strong>'
        })
    }

    /*
    Make a similar function to fetch humidity
    */
    const fetchHumidity = () => {
      fetch('/humidity')
        .then(results => {
          return results.json();
        })
        .then(data => {
          const now = new Date()
          const timeNow = now.getHours() + ':' + 
    now.getMinutes() + ':' + now.getSeconds()
 
          pushData(humidityChartConfig.data.labels,
     timeNow, 10)
          pushData(humidityChartConfig.data.datasets[0]
     .data, data.value, 10)

          humidityChart.update()
    

          hunidityDisplay.innerHTML = '<strong>' + data.value  + '</strong>';
        });
    }

    const fetchTemperatureHistory = () => {
      /**
       * Call the APi we created
       */
      fetch('/temperature/history')
        .then(results => {
          return results.json()
        })
        .then(data => {
          data.forEach(reading => {
            /**
             * For each reading present in the "data" array,
             * convert the time to the ISO Z format accepted 
     by the javascript Date object
             * Format the time and push data on to the chart,
      similar to the previous API calls
             */
            const time = new Date(reading.createdAt + 'Z')
            const formattedTime =
            time.getHours() + ':' + time.getMinutes() + ':' +
     time.getSeconds()
            pushData(temperatureChartConfig.data.labels, 
    formattedTime, 10)
            pushData(temperatureChartConfig.data.datasets[0]
    .data, reading.value, 10)
          })

          /**
           * Finally, update the chart after all readings have
     been pushed
           */
          temperatureChart.update()
        })
    }

    fetchTemperatureHistory()

    /**
     * We first define a function to extract the parameters
     from the request query.
     * You do not need to be concerned too much with its 
    implementation, although you could always study it as an 
    excercise.
     */
    function getParameterByName (name) {
      const url = window.location.href
      name = name.replace(/[\[\]]/g, '\\$&')
      const regex = new RegExp('[?&]' + name + 
        '(=([^&#]*)|&|#|$)')
      const results = regex.exec(url)
      if (!results) return null
      if (!results[2]) return ''
      return decodeURIComponent(results[2].replace(/\+/g, ' '))
    }

    const fetchTemperatureRange = () => {
      /**
       * The getParameterByName function is used to get the
       "start" and "end"
       * parameters from the query
       */
      const start = getParameterByName('start')
      const end = getParameterByName('end')

      /**
       * These parameters are then passed on to make AJAX 
     requests to get the range of
       * readings from the server
       */
      fetch(`/temperature/range?start=${start}&end=${end}`)
         .then(results => {
          return results.json()
        })
        .then(data => {
          data.forEach(reading => {
            /**
             * These readings are pushed to the chart
             */
            const time = new Date(reading.createdAt + 'Z')
            const formattedTime =
              time.getHours() + ':' + time.getMinutes() + ':' 
     + time.getSeconds()
             pushData(temperatureChartConfig.data.labels,
     formattedTime, 10)
           pushData(
               temperatureChartConfig.data.datasets[0].data,
             reading.value,
              10
           )
          })
          temperatureChart.update()
        })
  
      /**
       * We also use this information to fetch the average by 
    calling the required
       * API, and updating the reading display with the result
       */
      fetch(`/temperature/average?start=${start}&end=${end}`)
        .then(results => {
         return results.json()
       })
        .then(data => {
          temperatureDisplay.innerHTML = '<strong>' + data.value + '</strong>'
        })
    }

    const fetchHumidityHistory = () => {
      fetch('/humidity/history')
        .then(results => {
          return results.json()
        })
        .then(data => {
          data.forEach(reading => {
            const time = new Date(reading.createdAt + 'Z')
            const formattedTime =
            time.getHours() + ':' + time.getMinutes() + ':' +
     time.getSeconds()
            pushData(humidityChartConfig.data.labels,
        formattedTime, 10)
           pushData(humidityChartConfig.data.datasets[0].data,
      reading.value, 10)
          })
          humidityChart.update()
        })
    }

    fetchHumidityHistory()

    const fetchHumidityRange = () => {
      /**
       * The getParameterByName function is used to get the
       "start" and "end"
       * parameters from the query
       */
      const start = getParameterByName('start')
      const end = getParameterByName('end')

      /**
       * These parameters are then passed on to make AJAX 
     requests to get the range of
       * readings from the server
       */
      fetch(`/humidity/range?start=${start}&end=${end}`)
         .then(results => {
          return results.json()
        })
        .then(data => {
          data.forEach(reading => {
            /**
             * These readings are pushed to the chart
             */
            const time = new Date(reading.createdAt + 'Z')
            const formattedTime =
              time.getHours() + ':' + time.getMinutes() + ':' 
     + time.getSeconds()
             pushData(humidityChartConfig.data.labels,
     formattedTime, 10)
           pushData(
               hunidityChartConfig.data.datasets[0].data,
             reading.value,
              10
           )
          })
          hunidityChart.update()
        })
  
      /**
       * We also use this information to fetch the average by 
    calling the required
       * API, and updating the reading display with the result
       */
      fetch(`/humidity/average?start=${start}&end=${end}`)
        .then(results => {
         return results.json()
       })
        .then(data => {
          hunidityDisplay.innerHTML = '<strong>' + data.value + '</strong>'
        })
    }

if (!getParameterByName('start') && !getParameterByName('end')) {
  /**
   * The fetchTemperature and fetchHumidity calls are now moved here
   * and are called only when the "start" and "end"
    parametes are not present in the query
   * In this case, we will be showing the live reading implementation
  */
  setInterval(() => {
    fetchTemperature()
    fetchHumidity()
  }, 2000)
  fetchHumidityHistory()
  fetchTemperatureHistory()
} else {
  /**
   * If we do have these parameters, we will only be 
showing the range of readings requested by calling the  
functions we defined in this section
   */
  fetchHumidityRange()
  fetchTemperatureRange()
}
 