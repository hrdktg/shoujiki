const express = require('express');
const cors = require('cors');
const monk = require('monk');
const rateLimit = require("express-rate-limit");

const app = express();

var url = process.env.MONGO_URI;
var MongoClient = require('mongodb').MongoClient;

function listAllMsg() {
    
}
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
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("sara");
        //var query = { address: "Park Lane 38" };
        const cond = {created: -1};
        dbo.collection("mews").find().sort(cond).toArray(function(err, result) {
            if (err) throw err;
            res.json(result);
            db.close();
        });
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

        insertData(mdata);
        res.json(mdata);
        console.log("Inserting data:", mdata);
    }
    else {
        res.status(422);
        res.json({
            message: 'Message not Valid!!'
        });
    }
})

function insertData(mdata) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("sara");

        dbo.collection("mews")
        .insert(mdata)
        .then((idata)=> {
            console.log("Inserted ", idata);
        })
        .catch((err)=> {
            console.log(err, " is caught")
        })
        .then(()=> db.close());
    }); 
}