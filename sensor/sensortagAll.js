var mqtt = require('mqtt');
var sensorTag = require('sensortag');
var noble = require('noble');
var moment = require("moment");

var client = mqtt.connect({host: '54.215.79.197', port: 1885});

var PERIOD = 1000;

var serviceUuids = ['aa80'];
var allowDuplicates = true;
var activeTags = [];

noble.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);

    if (state === 'poweredOn') {
        if (process.platform === 'linux') {
            setInterval(function() {
                noble.startScanning(serviceUuids, allowDuplicates);
            }, 4000);
        } else {
            noble.startScanning(serviceUuids, allowDuplicates);
        }
    } else {
        noble.stopScanning();
    }
});

noble.on('discover', function(peripheral) {
    //console.log('on -> discover: ' + peripheral);

    //var name = peripheral.advertisement.localName;
    //if (name && name.search('SensorTag') !== -1) 
    {
        if (activeTags.indexOf(peripheral.id) === -1) { 
            activeTags.push(peripheral.id);
            discover(peripheral.id);
        }
    }
});

noble.on('scanStart', function() {
  console.log('on -> scanStart');
});

noble.on('scanStop', function() {
  console.log('on -> scanStop');
});

function discover(id) {
    sensorTag.discoverById(id, function(tag) {
        console.log('sensortag discover: ' + tag.id);
        var tagId = tag.id;
        var topic = 'astro/' + tagId;
        var topicAcc = topic + '/acc';
        var topicTmp = topic + '/tmp';
        var topicHum = topic + '/hum';
        var topicPrs = topic + '/prs';
        var topicLux = topic + '/lux';
        var topicMag = topic + '/mag';
        var topicGyr = topic + '/gyro';

        tag.on('disconnect', function() {
            console.log('sensortag disconnected: ' + tagId);
            var index = activeTags.indexOf(tagId);
            if (index > -1) activeTags.splice(index, 1);
            //process.exit(0);
        });

        function connectAndSetUpMe() {
            console.log('sensortag connect+setup: ' + tagId);
            tag.connectAndSetUp(enableSensors);
        }

        function enableSensors() {
            console.log('sensortag enable sensors: ' + tagId);
           
            tag.enableIrTemperature(function() {
            tag.setIrTemperaturePeriod(PERIOD, function() {});
                tag.notifyIrTemperature(listenForTemp);
            });

            tag.enableHumidity(function() {
            tag.setHumidityPeriod(PERIOD, function() {});
                tag.notifyHumidity(listenForHumidity);
            });

            tag.enableBarometricPressure(function() {
            tag.setBarometricPressurePeriod(PERIOD, function() {});
                tag.notifyBarometricPressure(listenForPressure);
            });

            tag.enableLuxometer(function() {
            tag.setLuxometerPeriod(PERIOD, function() {});
                tag.notifyLuxometer(listenForLux);
            });

            tag.enableGyroscope(function() {
            tag.setGyroscopePeriod(PERIOD, function() {});
                tag.notifyGyroscope(listenForGyro);
            });

            tag.enableAccelerometer(function() {
            tag.setAccelerometerPeriod(PERIOD, function() {});
                tag.notifyAccelerometer(listenForAcc);

            });

            tag.enableMagnetometer(function() {
            tag.setMagnetometerPeriod(PERIOD, function() {});
                tag.notifyMagnetometer(listenForMag);
            });

            tag.notifySimpleKey(listenForButton);        
        }

        function listenForTemp() {
            tag.on('irTemperatureChange', function(objectTemp, ambientTemp) {
                var json = JSON.stringify({obj:objectTemp, amb: ambientTemp, id: tagId, ts:moment().unix()});
                client.publish(topicTmp, json);
            }); 
        }

        function listenForHumidity() {
            tag.on('humidityChange', function(temperature, humidity) {
                var json = JSON.stringify({hum: humidity, id: tagId, ts:moment().unix()});
                client.publish(topicHum, json);
            });
        }

        function listenForPressure() {
            tag.on('barometricPressureChange', function(pressure) {
                var json = JSON.stringify({prs: pressure, id: tagId, ts:moment().unix()});
                client.publish(topicPrs, json);
            });
        }

        function listenForLux() {
            tag.on('luxometerChange', function(lux) {
                var json = JSON.stringify({lux: lux, id: tagId, ts:moment().unix()});
                client.publish(topicLux, json);
            });
        }

        function listenForGyro() {
            tag.on('gyroscopeChange', function(x, y, z) {
                var json = JSON.stringify({x:x, y:y, z:z, id: tagId, ts:moment().unix()});
                client.publish(topicGyr, json);
            });
        }

        function listenForAcc() {
            tag.on('accelerometerChange', function(x, y, z) {
                //console.log("getting acc (" +tagId+"): " + x + " " + y + " " + z);
                var json = JSON.stringify({x:x, y:y, z:z, id: tagId, ts:moment().unix()});
                client.publish(topicAcc, json);
            });
        }

        function listenForMag() {
            tag.on('magnetometerChange', function(x, y, z) {
                var json = JSON.stringify({x:x, y:y, z:z, id: tagId, ts:moment().unix()});
                client.publish(topicMag, json);
            });
        }

        function listenForButton() {
            tag.on('simpleKeyChange', function(left, right) {
                if (left) {
                    console.log('sensortag left: ' + tagId);
                }
                if (right) {
                    console.log('sensortag right: ' + tagId);
                }
                if (left && right) {
                    //tag.disconnect();
                }
            });
        }

        // start the process
        connectAndSetUpMe();
    });
}
