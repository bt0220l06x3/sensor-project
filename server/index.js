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
    'public')))

app.get('/temperature', function(req, res) {
  res.send('<strong>' + getCachedSensorReadings.getTemperature().toFixed(1) + '</strong>' + '°C');
});

app.get('/humidity', function(req, res) {
  res.send('<strong>' + getCachedSensorReadings.getHumidity().toFixed(1) + '</strong>' + '%');
});

app.listen(3000, function(){
	console.log('Server listening on port 3000');
});

