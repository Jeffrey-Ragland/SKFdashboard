const mongoose = require('mongoose');

const QueriesSchema = new mongoose.Schema(
    {
        Name: String,
        Query: String
    }
)

const queryModel = mongoose.model("query", QueriesSchema);
module.exports = queryModel;