const express = require('express');
const app = express();
const getCachedSensorReadings = require('./get-cached-sensor-readings');

app.get('/temperature', function(req, res) {
  res.send(getCachedSensorReadings.getTemperature().toFixed(1) + '°C');
});

app.get('/humidity', function(req, res) {
  res.send(getCachedSensorReadings.getHumidity().toFixed(1) + '%');
});

app.listen(3000, function(){
	console.log('Server listening on port 3000');
});

