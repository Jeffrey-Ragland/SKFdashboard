import mongoose from  'mongoose';

const EmployeeSchema = new mongoose.Schema(
    {
        Email: String,
        Password: String,
    }
)

const EmployeeModel = mongoose.model('employees', EmployeeSchema)
export default EmployeeModel;

