const express = require('express')
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const url = "mongodb://champ:champ@ds159776.mlab.com:59776/demo";
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Hello World');
});


app.get('/users', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var database = db.db("demo");
        database.collection("users").find({}).toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
            res.status(200).end();
        });
        db.close();
    });

});

app.post('/users', function (request, res) {
    var userData = {
        firstname: request.body.firstname,
        lastname: request.body.lastname,
        email: request.body.email,
        age: request.body.age
    };

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var database = db.db("demo");
        database.collection("users").insertOne(userData, function (err, result) {
            if (err) throw err;
            res.end('{"success" : "Updated Successfully", "status" : 200}');
        });
        db.close();
    });
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

