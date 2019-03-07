const express = require('express');
const cors = require('cors');
const monk = require('monk');
const rateLimit = require("express-rate-limit");

const app = express();

//database
const db = monk(process.env.MONGO_URI || 'localhost/sara')

//collection - touch
const mews = db.get('mews');

//Adds cors as middleware
//All requests automatically pass through this middleware
//Automatically adds proper headers
app.use(cors());
app.use(express.json());

app.listen(5000, ()=> {
    console.log('Listening on http://localhost:5000');
});

app.get('/', (req, res)=> {
    res.json({
        message: 'hey111'
    });
});

app.get('/getMsg', (req, res)=> {
    mews
    .find()
    .then(mews=>{
        res.json(mews);
    });
});

function isValidMsg(msg) {
    return msg.name && msg.name.toString().trim()!='' &&
           msg.content && msg.content.toString().trim()!=''
}

app.use(rateLimit({
    windowMs: 10*1000,
    max: 3
}));

app.post('/send', (req, res)=> {
    console.log(req.body);
    console.log(req.body.name, ' and ', req.body.content);

    if(isValidMsg(req.body)) {
        //Insert into database,,,
        const mdata = {
            name: req.body.name.toString(),
            content: req.body.content.toString(),
            created: new Date()
        };

        mews
            .insert(mdata)
            .then(createdData => {
                res.json(createdData);
            });
        
        console.log("Inserting data:", mdata);
    }
    else {
        res.status(422);
        res.json({
            message: 'Message not Valid!!1'
        });
    }
})