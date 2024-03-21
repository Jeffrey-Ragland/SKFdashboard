import EmployeeModel from './models/EmpSchema.js';
import sensorModel from './models/SensorSchema.js';
import apiTokenModel from './models/ApiTokenSchema.js';
import queryModel from './models/QueriesSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


//http://localhost:3001/backend/signup
export const signup = (req,res) =>
{
    const {Email,Password} = req.body;
    bcrypt.hash(Password, 10)
    .then(hash => 
        {
            EmployeeModel.create({Email,Password: hash})
            .then(employees => res.json(employees))
            .catch(err => res.json(err))
        })
    .catch(err => console.log(err.message))
    
};

//for login
export const login = (req,res) =>
{
    const {Email, Password} = req.body;
    EmployeeModel.findOne({Email: Email})
    .then(user =>
        {
            if(user)
            {
                bcrypt.compare(Password, user.Password, (err, response) =>
                {
                    if(response)
                    {
                        let redirectUrl = '';
                        if(user.Email === 'skf@xyma.in')
                        {
                            redirectUrl = '/dashmain';
                        }
                        else if(user.Email === 'admin@xyma.in')
                        {
                            redirectUrl = '/dashadmin'
                        }

                        const token = jwt.sign({Email: user.Email}, "jwt-secret-key", {expiresIn:"1d"})
                
                        res.json({token : token, redirectUrl: redirectUrl});
                        
                    }
                    else
                    {
                        res.json("Incorrect Password")
                    }
                })
                
            } 
            else
            {
                res.json("invalid user")
            }
        })
        .catch(err => console.log(err));
};

//sensor DB CRUD

//create
//http://localhost:3001/backend/create?Sensor1=10&Sensor2=30&Sensor3=30&Sensor4=40&Sensor5=50
export const create = (req,res) =>
{
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined')
    {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        jwt.verify(bearerToken, 'jwtsecrettoken', (err, decoded) =>
        {
            if(err)
            {
                res.sendStatus(403);
            }
            else
            {
                apiTokenModel.findOne({Token: bearerToken})
                .then(token =>
                {
                    if(token)
                    {
                        const data = req.query;
                        data.Time = new Date().toLocaleString();
                        const newData = new sensorModel(data);
                        newData.save()
                        .then(savedData =>
                            {
                                res.send({success : true, message: "data saved", data: savedData});
                            })
                        .catch(error =>
                            {
                                res.status(500).json({error: error.message});
                            });
                    }
                    else
                    {
                        res.sendStatus(403);
                    }
                    })
                    .catch(error =>
                        {
                            res.status(500).json({error: error.message});
                        });
                    }
        });
    }
    else
    {
        res.sendStatus(403);
    }
};

//read //used in dashmain->chart,activity status; dashreports->download pdf; dashadmin->activity status and pdf
//http://localhost:3001/backend/read
export const read =  async(req,res) =>
{
    const id= req.params.id;
    //const data = await sensorModel.findById(id);
    const data = await sensorModel.find().sort({_id: -1});
    
    if (data) {
        res.json({ success: true, data: data});
    } else {
        res.json({ success: false, message: "Data not found" });
    }
};

//read //used in dashadmin->table
//http://localhost:3001/backend/readLimit
export const readLimit = async(req,res) =>
{
    const id= req.params.id;
    //const data = await sensorModel.findById(id);
    const data = await sensorModel.find().sort({_id: -1}).limit(100);
    
    if (data) {
        res.json({ success: true, data: data});
    } else {
        res.json({ success: false, message: "Data not found" });
    }
};

//read //used in dashmain-> table
//http://localhost:3001/backend/readLimitMain
export const readLimitMain =  async(req,res) =>
{
    const id= req.params.id;
    //const data = await sensorModel.findById(id);
    const data = await sensorModel.find().sort({_id: -1}).limit(30);
    
    if (data) {
        res.json({ success: true, data: data});
    } else {
        res.json({ success: false, message: "Data not found" });
    }
};

//read //used in dashgraph->line chart
//http://localhost:3001/backend/readSensor/1
export const readSensorGraph =  async(req, res) =>
{
    const sensorId = req.params.sensorId;
    const limit = parseInt(req.query.limit); //data limit
    const data = await sensorModel.find().sort({_id: -1}).limit(limit).select(`Sensor${sensorId} Time`);
    
    if(data)
    {
        res.json({success: true, data: data.reverse()});
    }
    else
    {
        res.json({success: false, message: "data not found"});
    }

};

// read //used in dashadmin -> line graph
//http://localhost:3001/backend/readSensorAdmin/1
export const readSensorAdmin = async(req, res) =>
{
    const sensorId = req.params.sensorId;
    const data = await sensorModel.find().sort({_id: -1}).limit(100).select(`Sensor${sensorId} Time`);
    
    if(data)
    {
        res.json({success: true, data: data.reverse()});
    }
    else
    {
        res.json({success: false, message: "data not found"});
    }

};

//update 
//http://localhost:3001/backend/update
export const update = async(req,res) =>
{
    console.log(req.body); 
    const {id, ...rest} = req.body
    console.log(rest)
    const data = await sensorModel.updateOne({_id : id},rest)
    res.send({success: true, message: "data updated", data : data})
};

//delete
//http://localhost:3001/backend/delete/
export const remove = async (req,res) => 
{
    const id = req.params.id
    console.log(id)
    const data = await sensorModel.deleteOne({_id:id})
    res.send({success: true, message: "data deleted", data : data})
};

//api token generation 
//http://localhost:3001/backend/generatetoken
export const generatetoken = (req, res) =>
{
    const token = jwt.sign({}, 'jwtsecrettoken', {expiresIn: '1d'});
    const newToken = new apiTokenModel({Token: token});

    newToken.save()
    .then(savedToken =>
        {
            res.json({token: savedToken.Token});
        })
        .catch(error =>
            {
                res.status(500).json({error: error.message});
            });
};

//query handling in dashsettings
//http://localhost:3001/backend/query
export const query = (req,res) =>
{
    const {Name, Query } = req.body;
    const newQuery = new queryModel({Name, Query});

    newQuery.save()
    .then(()=>
    {
        res.status(201).json({message: "Query stored"})
    })
    .catch(err => res.status(500).json({error: err.message}));
};
