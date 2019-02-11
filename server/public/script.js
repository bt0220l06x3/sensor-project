console.log('Executing client side javascript...');

/*
     The fetch API uses a promise based syntax. It may look a  
    little weird if you're seeing it for the first time, but    
    it's an improvement over callbacks.
    */

    /*
    First, we instantiate the first promise, which call the 
    API at /temperature of our server
    */
    fetch('/temperature')
    .then(results => {
      /*
      results.text() returns another promise, which resolves 
    to the text response we receive from the API
      */
      return results.text()
    })
    .then(text => {
      /*
       This "text" variable is the response that the server 
    gives us. Logging it on the console will show you " 
      <strong>10.0</strong>°C"
      */
      console.log(text)
    });
    
