import express from 'express';
import {signup,
        login,
        create,
        read,
        readLimit,
        readLimitMain,
        readSensorGraph,
        readSensorAdmin,
        update,
        remove,
        generatetoken,
        query,
        createProject,
        insertProjectData,
        displayProjectData,
        displayProjectDataLimit} from './index.js';


const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.get('/create',create);
router.get('/read',read); //dashmain->chart,activity status; dashreports->download pdf; dashadmin->activity status and pdf
router.get('/readLimit',readLimit); //dashadmin->table
router.get('/readLimitMain',readLimitMain); //dashmain-> table
router.get('/readSensor/:sensorId',readSensorGraph); //dashgraph->line chart
router.get('/readSensorAdmin/:sensorId',readSensorAdmin); //dashadmin -> line graph
router.put('/update',update);
router.delete('/delete/:id',remove);
router.post('/generatetoken',generatetoken); //api token generation
router.post('/query',query); //dashSettings->customer support
router.post('/createproject',createProject); //dashadmin->add data
router.get('/insertProjectData',insertProjectData);
router.post('/displayProjectData',displayProjectData);
router.post('/displayProjectDataLimit',displayProjectDataLimit);

export default router;