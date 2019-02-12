const express = require('express');
const path = require('path');
const app = express();
const getCachedSensorReadings = require('./get-cached-sensor-readings');

/*
    Here, we are introduced to express middleware.
    Middleware is a fancy word to describe a set of actions  
    that have to take place before the request handler.

    In the below statement, we use the express.static 
    middleware, and bind it to the /public route.
    */
    app.use('/public', express.static(path.join(__dirname, 
    'public')));

app.get('/temperature', function(req, res) {
     /**
       * The express response object comes with a built in 
    `json` method
       * This automatically converts its first argument into 
    a JSON string, and sends it along with the content type 
    headers as a response.
       */
      res.json({
        value: 
    getCachedSensorReadings.getTemperature().toFixed(1)
      })
});

app.get('/humidity', function(req, res) {
      res.json({
        value: 
    getCachedSensorReadings.getHumidity().toFixed(1)
      })
});

app.listen(3000, function(){
	console.log('Server listening on port 3000');
});

