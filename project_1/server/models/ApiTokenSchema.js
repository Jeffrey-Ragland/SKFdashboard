import mongoose from  'mongoose';

const ApiTokenSchema = new mongoose.Schema(
    {
        Token: String
    },
    {
        timestamps : true
    }
)

const apiTokenModel = mongoose.model('apiToken',ApiTokenSchema);
export default apiTokenModel