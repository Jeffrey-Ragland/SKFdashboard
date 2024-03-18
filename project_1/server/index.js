const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const EmployeeModel = require('./models/EmpSchema')
const sensorModel = require('./models/SensorSchema')
const apiTokenModel = require('./models/ApiTokenSchema')
const queryModel = require('./models/QueriesSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
//const cookieParser = require('cookie-parser')

const app = express()
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}))
//app.use(cookieParser())

mongoose.connect('mongodb://127.0.0.1:27017/employee');

//login authentication
// const verifyUser = (req,res, next) =>
// {
//     const token = req.headers.authorization;

//     if(!token)
//     {
//         return res.json("token  not available")
//     }
//     else
//     {
//         jwt.verify(token.split(' ')[1],"jwt-secret-key",(err,decoded) =>
//         {
//            if(err) return res.json("wrong token")
//            next(); 
//         })
//     }
// }
// app.get('/dashmain',verifyUser);

 
// api authentication  

const verifyToken = (req, res, next) =>
{
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined')
    {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token= bearerToken;
       
        apiTokenModel.findOne({Token: bearerToken})
        .then(token =>
            {
                if(token)
                {
                    next();
                }
                else
                {
                    res.sendStatus(403);
                }
            }) 
            .catch(error=>
                {
                    res.status(500).json({error: error.message});
                });
    }

    else
    {
        res.sendStatus(403);
    }
}


// app.post('/logout',(req,res) =>
// {
//     res.json({message: 'logout successful'});
// });

// http://localhost:3001/signup

app.post('/signup',(req,res) =>
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
    
})

app.post("/login", (req,res) =>
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
})


//sensor db crud


//create
//http://localhost:3001/create?Sensor1=10&Sensor2=30&Sensor3=30&Sensor4=40&Sensor5=50

app.get("/create",verifyToken, (req,res) =>
{
    jwt.verify(req.token, 'jwtsecrettoken', (err) =>
    {
        if(err)
        {
            res.sendStatus(403);
        }
        else
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
                })
        }
    })
   
})


//read //used in dashmain,dashreports->download pdf, dashadmin->activity status and pdf
//http://localhost:3001/read

app.get("/read", async(req,res) =>
{
    const id= req.params.id;
    //const data = await sensorModel.findById(id);
    const data = await sensorModel.find().sort({_id: -1});
    
    if (data) {
        res.json({ success: true, data: data});
    } else {
        res.json({ success: false, message: "Data not found" });
    }
})

//read //used in dashadmin-> table
//http://localhost:3001/readLimit
app.get("/readLimit", async(req,res) =>
{
    const id= req.params.id;
    //const data = await sensorModel.findById(id);
    const data = await sensorModel.find().sort({_id: -1}).limit(100);
    
    if (data) {
        res.json({ success: true, data: data});
    } else {
        res.json({ success: false, message: "Data not found" });
    }
})

//read for line chart/ dashgraph
//http://localhost:3001/readSensor/1

app.get("/readSensor/:sensorId", async(req, res) =>
{
    const sensorId = req.params.sensorId;
    const data = await sensorModel.find().sort({_id: -1}).limit(30).select(`Sensor${sensorId} Time`);
    
    if(data)
    {
        res.json({success: true, data: data.reverse()});
    }
    else
    {
        res.json({success: false, message: "data not found"});
    }

})

// read for dashadmin -> line graph
//http://localhost:3001/readSensorAdmin/1
app.get("/readSensorAdmin/:sensorId", async(req, res) =>
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

})


//update 
//http://localhost:3001/update

app.put("/update", async(req,res) =>
{
    console.log(req.body); 
    const {id, ...rest} = req.body
    console.log(rest)
    const data = await sensorModel.updateOne({_id : id},rest)
    res.send({success: true, message: "data updated", data : data})
})

//delete
//http://localhost:3001/delete/

app.delete("/delete/:id", async (req,res) => 
{
    const id = req.params.id
    console.log(id)
    const data = await sensorModel.deleteOne({_id:id})
    res.send({success: true, message: "data deleted", data : data})
})

//api token generation 

// http://localhost:3001/generatetoken

app.post('/generatetoken', (req, res) =>
{
    const token = jwt.sign({}, 'jwtsecrettoken', {expiresIn: '1d'});
   // res.json({token});

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
});

//query handling in dashsettings

// http://localhost:3001/query

app.post('/query', (req,res) =>
{
    const {Name, Query } = req.body;
    const newQuery = new queryModel({Name, Query});

    newQuery.save()
    .then(()=>
    {
        res.status(201).json({message: "Query stored"})
    })
    .catch(err => res.status(500).json({error: err.message}));
});

app.listen(3001,() =>
{
    console.log('server is running')
})  