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
          return results.text()
        })
        .then(text => {
          const temperatureDisplay = 
    document.getElementById('temperature-display')
          temperatureDisplay.innerHTML = text
        })
    }

    /*
    Make a similar function to fetch humidity
    */
    const fetchHumidity = () => {
      fetch('/humidity')
        .then(results => {
          return results.text()
        })
        .then(text => {
          const temperatureDisplay = 
    document.getElementById('humidity-display')
          temperatureDisplay.innerHTML = text
        })
    }

    /*
    Call the above defined functions at regular intervals
    */
    setInterval(() => {
      fetchTemperature()
      fetchHumidity()
    }, 2000)
    