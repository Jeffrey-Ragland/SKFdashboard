import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
    {
        projectName: String,
        email: String,
        password: String,
        parameters: String,
        parameterValues: Object
    }
);

const projectModel = mongoose.model('project',ProjectSchema);
export default projectModel;