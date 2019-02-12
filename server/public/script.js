console.log('Executing client side javascript...');

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
          const temperatureDisplay = 
    document.getElementById('temperature-display')
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
    
          const temperatureDisplay = 
    document.getElementById('humidity-display')
          temperatureDisplay.innerHTML = '<strong>' + data.value  + '</strong>';
        });
    }

    /*
    Call the above defined functions at regular intervals
    */
    setInterval(() => {
      fetchTemperature();
      fetchHumidity();
    }, 2000);
 
