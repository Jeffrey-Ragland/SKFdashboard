const mongoose = require('mongoose');

const SensorSchema = new mongoose.Schema(
    {
        Sensor1: Number,
        Sensor2: Number,
        Sensor3: Number,
        Sensor4: Number,
        Sensor5: Number,
        Time: String
    }
)

const sensorModel = mongoose.model("sensor", SensorSchema);
module.exports = sensorModel;