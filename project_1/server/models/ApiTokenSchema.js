const mongoose = require('mongoose')

const ApiTokenSchema = new mongoose.Schema(
    {
        Token: String
    },
    {
        timestamps : true
    }
)

const apiTokenModel = mongoose.model('apiToken',ApiTokenSchema);
module.exports = apiTokenModel;