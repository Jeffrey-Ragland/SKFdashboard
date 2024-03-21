import mongoose from  'mongoose';

const QueriesSchema = new mongoose.Schema(
    {
        Name: String,
        Query: String
    }
)

const queryModel = mongoose.model("query", QueriesSchema);
export default queryModel