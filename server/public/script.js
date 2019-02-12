console.log('Executing client side javascript...');

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
          /**
           * In our server API route handler, the format of 
    returned data was an object with a `value` property.
           * The value of the sensor reading is therefore 
    available in `data.value`
           */
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
 
       /**
     * Get the context of the temperature canvas element
     */
     const temperatureCanvasCtx = 
     document.getElementById('temperature-chart').getContext('2d')

    /**
     * Create a new chart on the context we just instantiated
    */
    const temperatureChart = new Chart(temperatureCanvasCtx, 
    {
      /**
       * Were going to show the ongoing temperature as a line 
    chart
       */
      type: 'line',
      data: {
        /**
         * This is mock data.
         * The labels, which will form our x-axis, are 
     supposed to represent the time at which each reading was 
     taken.
         * Finally, we add the dataset, whose data is an 
     array of temperature values.
         * The background color is set to the same value as 
     the earlier display, with some added transparency (which 
     is why the 'rgba' representation is used)
         */
        labels: ['10:30', '10:31', '10:32', '10:33'],
        datasets: [{
          data: [12, 19, 23, 17],
          backgroundColor: 'rgba(255, 205, 210, 0.5)'
        }]
      },
      options: {
        /**
         * There is no need for a legend since there is only 
    one dataset plotted
         * The 'responsive' and 'maintainAspectRatio' options 
    are set so that the chart takes the width and height of 
    the canvas, and does not set it on its own.
         */
        legend: {
          display: false
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
    
