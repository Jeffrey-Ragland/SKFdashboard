import mongoose from  'mongoose';

const EmployeeSchema = new mongoose.Schema(
    {
        Project: String,
        Email: String,
        Password: String,
        Parameters: String,
        ParameterValues: Object
    }
)

const EmployeeModel = mongoose.model('employees', EmployeeSchema)
export default EmployeeModel;