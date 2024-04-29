import EmployeeModel from './models/EmpSchema.js';
import sensorModel from './models/SensorSchema.js';
import apiTokenModel from './models/ApiTokenSchema.js';
import queryModel from './models/QueriesSchema.js';
//import projectModel from './models/ProjectSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { name } from 'ejs';

//http://localhost:3001/backend/signup
export const signup = (req,res) =>
{
    const {Project,Email,Password} = req.body;
    bcrypt.hash(Password, 10)
    .then(hash => 
        {
            EmployeeModel.create({Project,Email,Password: hash})
            .then(employees => res.json(employees))
            .catch(err => res.json(err))
        })
    .catch(err => console.log(err.message))
    
};

//for login
export const login = (req,res) =>
{
    const {Project,Email, Password} = req.body;
    EmployeeModel.findOne({Project: Project,Email: Email})
    .then(user =>
        {
            if(user)
            {
                bcrypt.compare(Password, user.Password, (err, response) =>
                {
                    if(response)
                    {
                        let redirectUrl = '';
                        let projectName = '';
                        if(user.Project === 'skf')
                        {
                            redirectUrl = '/dashmain';
                            projectName = 'skf'
                        }
                        else if(user.Project === 'admin')
                        {
                            redirectUrl = '/dashadmin';
                            projectName = 'admin';
                        }
                        else
                        {
                            redirectUrl = '/displayMain'
                            projectName = user.Project;
                        }
                        // token generation
                        const token = jwt.sign({Email: user.Email}, "jwt-secret-key", {expiresIn:"1d"})
                        // role assignment
                        let role='';
                        if(user.Email === 'admin@xyma.in')
                        {
                            role = 'admin';
                        }
                        else if(user.Email !== 'admin@xyma.in')
                        {
                            role = 'client';
                        }
                
                        res.json({token : token, role: role, redirectUrl: redirectUrl, projectName}); 
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

//add data -> dashadmin
//creates collection named projects which includes projectName,email,password,parameters,parameterValues
export const createProject = (req,res) =>
{
console.log('request body',req.body);
{
        const {Project, Email,Password,Parameters,ParameterValues} = req.body;
        bcrypt.hash(Password, 10)
        .then(hash =>
        {
            const newProject = new EmployeeModel({Project, Email,Password: hash,Parameters,ParameterValues});
            newProject.save()
            .then(()=>
            {
            res.status(201).json({message: "Project stored"})
            })
            .catch(err => res.status(500).json({error: err.message}));
        })
        .catch(err => console.log(err.message));    
}};

//schema is given outside the function to avoid creating db model repeatedly
const projectDataSchema = new mongoose.Schema({
    Time: String
});

//the generated insert link from the frontend after submitting the form is used to insert data into this collection
export const insertProjectData = (req, res) => {
    const projectName = req.query.projectName;
    const parameterValues = Object.keys(req.query).filter(key => key !== 'projectName');

    //creates dynamic schema
    const dynamicSchema = {};
    parameterValues.forEach(param => {
        dynamicSchema[param] = String;
    });

    projectDataSchema.add(dynamicSchema);

    const projectDataModel = mongoose.models[projectName] || mongoose.model(projectName, projectDataSchema, projectName);

    //creates dynamic field according to parameterValues
    const projectDataObject = {};
    parameterValues.forEach(param => {
        projectDataObject[param] = req.query[param];
    });
    
    projectDataObject.Time = new Date().toLocaleString();
    console.log('projectdata object',projectDataObject);

    const projectData = new projectDataModel(projectDataObject);
    console.log('project data', projectData);
    projectData.save()
        .then(() => {
            res.status(201).json({ message: "Project data stored" });
        })
        .catch(err => res.status(500).json({ error: err.message }));
}

export const displayProjectData = async (req,res) => {
    const {projectName} = req.body;
    const collection = mongoose.connection.db.collection(projectName);
    const projectData = await collection.find({}).sort({_id: -1}).toArray();
    let result = '';
        if (projectData.length > 0) 
        {
            console.log(`Collection ${projectName} found`);
            res.json({ result: `Collection ${projectName} found`,success: true, data: projectData });
        } 
        else 
        {
            console.log(`Collection ${projectName} not found`);
            result = `Collection ${projectName} not found`;
        }
}

export const displayProjectDataLimit = async (req,res) => {
    const {projectName, limit} = req.body;
    const collection = mongoose.connection.db.collection(projectName);
    const projectData = await collection.find({}).sort({_id: -1}).limit(limit).toArray();
    let result = '';
        if (projectData.length > 0) 
        {
            console.log(`Collection ${projectName} found`);
            res.json({ result: `Collection ${projectName} found`,success: true, data: projectData });
        } 
        else 
        {
            console.log(`Collection ${projectName} not found`);
            result = `Collection ${projectName} not found`;
        }
}
